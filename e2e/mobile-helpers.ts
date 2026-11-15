import { test, type Page } from '@playwright/test';

export type Route = { name: string; path: string };

const LOCALES = ['en', 'ua'] as const;
const LOCALE_PAGES = [
  ['home', ''],
  ['about', '/about'],
  ['contacts', '/contacts'],
  ['news', '/news'],
  ['news-item', '/news/:news'],
  ['events', '/events'],
  ['event-item', '/events/:event'],
  ['projects', '/projects'],
  ['program-item', '/program/:program'],
] as const;

export const ROUTES: Route[] = [
  ...LOCALES.flatMap(l =>
    LOCALE_PAGES.map(([page, suffix]) => ({
      name: `${l}-${page}`,
      path: `/${l}${suffix}`,
    })),
  ),
  { name: 'donation', path: '/donation' },
  { name: 'donation-finish', path: '/donation/finish' },
  { name: 'donation-error', path: '/donation/error' },
  { name: 'subscribe', path: '/subscribe' },
  { name: 'unsubscribe', path: '/unsubscribe' },
  { name: 'inactive-link', path: '/inactive-link' },
];

// Route names whose tap-target / overflow test is still expected to fail.
// Tasks remove a name once they fix that route.
// inactive-link and donation already have no undersized targets, so they start out fixed.
// Home was fixed in Task 8; its shared footer/social/tab fixes also cleared
// program-item, the donation result pages, subscribe and unsubscribe.
// About was fixed in Task 9.
export const PENDING_TARGETS = new Set<string>(
  ROUTES.map(r => r.name).filter(
    n =>
      ![
        'inactive-link',
        'donation',
        'en-home',
        'ua-home',
        'en-about',
        'ua-about',
        'en-program-item',
        'ua-program-item',
        'donation-finish',
        'donation-error',
        'subscribe',
        'unsubscribe',
      ].includes(n),
  ),
);
export const PENDING_OVERFLOW = new Set<string>([]);

type DetailIds = { news: string; event: string; program: string };

async function firstId(
  page: Page,
  listPath: string,
  segment: string,
): Promise<string | null> {
  await page.goto(listPath);
  const link = page.locator(`a[href*="/${segment}/"]`).first();
  try {
    await link.waitFor({ state: 'attached', timeout: 15_000 });
  } catch {
    return null;
  }
  const href = (await link.getAttribute('href')) ?? '';
  return href.split(`/${segment}/`)[1]?.split(/[/?#]/)[0] || null;
}

// Neither /en/projects nor the home programs slider renders a /program/<id>
// anchor (the slider navigates via router.push), so take the first id from the
// public programs search the home page fires.
async function firstProgramId(page: Page): Promise<string | null> {
  const response = page.waitForResponse(
    r => r.url().includes('articleType=PROGRAM') && r.ok(),
    { timeout: 20_000 },
  );
  await page.goto('/en');
  try {
    const body = await (await response).json();
    const id = body?.content?.[0]?.id;
    return id == null ? null : String(id);
  } catch {
    return null;
  }
}

let cached: DetailIds | undefined;

export async function resolveDetailIds(page: Page): Promise<DetailIds> {
  if (cached) return cached;
  const news = await firstId(page, '/en/news', 'news');
  const event = await firstId(page, '/en/events', 'events');
  const program = await firstProgramId(page);
  test.skip(
    !news || !event || !program,
    'no news/event/program item available to open',
  );
  cached = { news: news!, event: event!, program: program! };
  return cached;
}

export async function collectViolations(
  page: Page,
): Promise<{ overflowPx: number; smallTargets: string[] }> {
  await page
    .waitForLoadState('networkidle', { timeout: 5_000 })
    .catch(() => {});
  return page.evaluate(() => {
    const doc = document.documentElement;
    const overflowPx = doc.scrollWidth - doc.clientWidth;
    const selector =
      'a, button, [role=button], input, select, textarea, summary';
    const smallTargets: string[] = [];
    for (const el of Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    )) {
      if (el.closest('.article-content, [aria-hidden="true"]')) continue;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      if (box.width >= 44 && box.height >= 44) continue;
      const label = (
        el.getAttribute('aria-label') ||
        el.textContent ||
        el.getAttribute('placeholder') ||
        el.getAttribute('href') ||
        el.tagName
      )
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 40);
      smallTargets.push(
        `${Math.round(box.width)}x${Math.round(box.height)} ${label}`,
      );
    }
    return { overflowPx, smallTargets };
  });
}
