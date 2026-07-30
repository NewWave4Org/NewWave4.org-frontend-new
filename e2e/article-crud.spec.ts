import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Article creation is TWO pages, not one, which the previous version of this
// spec got wrong:
//
//   /admin/articles/new              -> ArticleForm.tsx    (title, project, author)
//                                       POST article/private — the row EXISTS from here
//                                       redirects to ?id=N
//   /admin/articles/new/content?id=N -> ArticleContent.tsx (text blocks, photos)
//                                       PUT article/private/{id}, does NOT navigate
//
// The old spec filled only a title on page one, then asserted a redirect to
// /admin/articles citing ArticleContent as its authority. Both halves were
// wrong: ArticleContent isn't mounted on /admin/articles/new at all, and its
// Save stays put rather than returning to the list.
//
// These tests hit the real staging backend (docs/testing.md), so titles are
// unique and everything created is torn down in afterEach — keyed on ids
// captured as we go, so a mid-test failure still cleans up rather than leaking
// a DRAFT row or an uploaded S3 object.

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;
const API = 'https://api.stage.newwave4.org';

// Populated during a test, consumed by afterEach.
let createdArticleId: number | null = null;
let uploadedPhotoUrl: string | null = null;

async function login(page: Page) {
  await page.goto('/admin');
  await page.getByLabel(/email address/i).fill(ADMIN_EMAIL!);
  await page.getByLabel(/^password/i).fill(ADMIN_PASSWORD!);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin\/(users|articles)/);
}

test.describe('article content management', () => {
  test.afterEach(async ({ page }) => {
    // Teardown goes through the API, not the UI: auth is httpOnly-cookie based
    // and page.request shares the browser context's cookie jar, so this is
    // authenticated without a token and unaffected by CORS. Much less flaky than
    // driving a modal, and it still runs when the test failed early. Errors are
    // swallowed so an already-deleted entity doesn't fail the run.
    if (uploadedPhotoUrl) {
      await page.request
        .delete(`${API}/api/photos/delete-photo`, {
          params: { url: uploadedPhotoUrl },
        })
        .catch(() => {});
      uploadedPhotoUrl = null;
    }
    if (createdArticleId !== null) {
      await page.request
        .delete(`${API}/api/v1/article/private/${createdArticleId}`, {
          params: { articleType: 'NEWS' },
        })
        .catch(() => {});
      createdArticleId = null;
    }
  });

  test('redirects an unauthenticated visitor away from the admin articles list', async ({
    page,
  }) => {
    await page.goto('/admin/articles');

    await expect(page).toHaveURL(/\/admin\/?$/);
  });

  test('creates a news article, adds content, and removes it again', async ({
    page,
  }) => {
    test.skip(
      !ADMIN_EMAIL || !ADMIN_PASSWORD,
      'E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD not provided',
    );

    const title = `E2E test article ${Date.now()}`;

    await login(page);

    // ---- step 1: create the article row -------------------------------------

    // The project dropdown is populated from published PROJECT articles. With
    // none, its only option is a disabled "No published projects available" and
    // the form is unsatisfiable — skip with a clear reason rather than failing on
    // a validation toast that would look like a broken selector.
    const projectsLoaded = page.waitForResponse(
      r =>
        r.url().includes('/article/public/search') &&
        r.url().includes('articleType=PROJECT'),
    );
    await page.goto('/admin/articles/new');
    const projects = await (await projectsLoaded).json().catch(() => null);
    test.skip(
      !projects?.content?.length,
      'staging has no PUBLISHED PROJECT articles, so the required project select cannot be satisfied',
    );

    await page.getByLabel(/^Title/).fill(title);

    // components/shared/Select.tsx is a div-based dropdown: no <select>, and its
    // <label for> points at an id nothing owns, so neither selectOption() nor
    // getByLabel() reach it. Click the trigger, then the option.
    await page.getByText('Choose project', { exact: true }).click();
    const firstProject = page.locator('div.shadow-custom > div').first();
    await expect(firstProject).toBeVisible();
    await firstProject.click();

    // AuthorField has a dropdown and a manual input writing the same Formik
    // field; the manual one is the robust half. Often already prefilled from the
    // current user, so this is belt-and-braces.
    await page.getByLabel('Enter manually').fill('E2E Author');

    const created = page.waitForResponse(
      r =>
        r.request().method() === 'POST' && r.url().includes('/article/private'),
    );
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    expect((await created).ok()).toBeTruthy();

    // The row exists from here on, so capture the id before anything else can
    // fail — afterEach needs it even if the content step below breaks.
    await expect(page).toHaveURL(/\/admin\/articles\/new\/content\?id=\d+/);
    createdArticleId = Number(new URL(page.url()).searchParams.get('id'));
    expect(createdArticleId).toBeGreaterThan(0);

    // ---- step 2: content ----------------------------------------------------

    // ArticleContent regenerates the editors' `key` with Date.now() once the
    // article GET resolves, remounting them and discarding anything typed
    // beforehand. Waiting for that fetch is the difference between this test
    // being reliable and being mysteriously flaky.
    await page.waitForResponse(
      r => new RegExp(`/article/public/${createdArticleId}$`).test(r.url()),
      { timeout: 15_000 },
    );

    // draft-js owns its DOM and rebuilds from EditorState, so fill() is silently
    // discarded — onChange never fires and the field stays empty. Real keystrokes
    // after a focusing click are what it actually consumes.
    const textBlock1 = page
      .locator('div.w-full.mb-2')
      .filter({ hasText: 'Text block 1' })
      .locator('.public-DraftEditor-content');
    await expect(textBlock1).toBeVisible();
    await textBlock1.click();
    await page.keyboard.type('E2E body text');
    await expect(textBlock1).toContainText('E2E body text');

    // react-dropzone's input is present but visually collapsed (opacity/width/
    // height 0, not display:none), so setInputFiles works. It uploads on
    // selection rather than on save, and accepts only .jpeg/.png/.webp/.jpg.
    const uploaded = page.waitForResponse(
      r =>
        r.url().includes('/photos/upload-photo') &&
        r.request().method() === 'POST',
    );
    await page
      .locator('div.flex.flex-col.h-full')
      .filter({ hasText: 'Main Photo' })
      .locator('input[type="file"]')
      .setInputFiles({
        name: 'e2e-main.png',
        mimeType: 'image/png',
        buffer: readFileSync('public/error.png'),
      });
    const uploadResponse = await uploaded;
    expect(uploadResponse.ok()).toBeTruthy();
    // Endpoint returns the URL as a bare string body; record it for teardown.
    uploadedPhotoUrl = (await uploadResponse.text())
      .trim()
      .replace(/^"|"$/g, '');
    expect(uploadedPhotoUrl).toBeTruthy();

    const saved = page.waitForResponse(
      r =>
        r.request().method() === 'PUT' &&
        r.url().includes(`/article/private/${createdArticleId}`),
    );
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    expect((await saved).ok()).toBeTruthy();

    // Form.onSubmit validates first and toasts this instead of submitting, so its
    // absence confirms every required field was genuinely satisfied.
    await expect(page.getByText(/Please fix validation errors/i)).toHaveCount(
      0,
    );

    // ---- it appears in the list --------------------------------------------

    await page.goto('/admin/articles');
    const row = page.getByRole('row').filter({ hasText: title });
    await expect(row).toBeVisible();

    // ---- delete it through the UI ------------------------------------------

    // Exercises the real delete path rather than relying only on API teardown.
    // The confirmation is a Redux-driven div (id from ModalType.DELETE_ARTICLE),
    // not a native confirm, so nothing blocks Playwright. Row and modal both
    // have a button named Delete, hence the scoping.
    await row.getByRole('button', { name: 'Delete' }).click();
    const modal = page.locator('#deleteArticle');
    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: 'Delete' }).click();

    await expect(row).toHaveCount(0);

    // Deleted via the UI, so afterEach's article DELETE would only 404 — clear it
    // so teardown has just the photo left to remove.
    createdArticleId = null;
  });
});
