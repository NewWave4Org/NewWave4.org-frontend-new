import '@testing-library/jest-dom/vitest';
import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import rootReducer from '@/store/rootReducer';
import { ArticleTypeEnum } from '@/utils/ArticleType';
import Article from './Article';

const h = vi.hoisted(() => ({
  params: { id: '10' } as { id: string },
  locale: 'ua',
  getArticleById: vi.fn(),
  getAllArticle: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useParams: () => h.params }));
vi.mock('next-intl', () => ({
  useLocale: () => h.locale,
  useTranslations: () => (key: string) => key,
}));
vi.mock('@/i18n', () => ({
  EN_LOCALE: 'en',
  Link: ({ children }: any) => children,
  useRouter: () => ({ back: vi.fn() }),
}));
vi.mock('@/utils/article-content', () => ({
  articleContentService: {
    getArticleById: h.getArticleById,
    getAllArticle: h.getAllArticle,
  },
}));
vi.mock('react-toastify', () => ({ toast: { error: h.toastError } }));
vi.mock('@/utils/hooks/useFancybox', () => ({ default: () => [vi.fn()] }));
vi.mock('../ui/SlickCarousel', () => ({ default: () => null }));
vi.mock('@/components/socialButtons/SocialButtons', () => ({
  default: () => null,
}));
// The block's own rendering is not under test here; only what Article hands it.
vi.mock('../OtherDopBlocks/OtherDopBlocks', () => ({
  default: ({ dopBlocks }: { dopBlocks: { id: number }[] }) => (
    <ul aria-label="related">
      {dopBlocks.map(b => (
        <li key={b.id}>related-{b.id}</li>
      ))}
    </ul>
  ),
}));

const articleDto = (id: number) => ({
  id,
  title: `Стаття ${id}`,
  titleEng: `Article ${id}`,
  contentBlocks: [],
  contentBlocksEng: [{ contentBlockType: 'TEXT', data: 'x' }],
  dateOfWriting: '2026-01-01',
});

const page = (ids: number[]) => ({
  content: ids.map(id => ({ id })),
  totalElements: ids.length,
});

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>(r => (resolve = r));
  return { promise, resolve };
}

function setup() {
  const store = configureStore({ reducer: rootReducer });
  const ui = () => (
    <Provider store={store}>
      <Article articleType={ArticleTypeEnum.NEWS} />
    </Provider>
  );
  const view = render(ui());
  return { store, rerender: () => view.rerender(ui()) };
}

const relatedIds = () =>
  screen.queryAllByText(/^related-\d+$/).map(el => el.textContent);

describe('Article — related articles', () => {
  beforeEach(() => {
    h.params = { id: '10' };
    h.locale = 'ua';
    h.getArticleById.mockImplementation(async (id: number) => articleDto(id));
  });
  afterEach(() => vi.clearAllMocks());

  it('shows related articles without overwriting the shared article list in Redux', async () => {
    h.getAllArticle.mockResolvedValue(page([1, 2, 3]));
    const { store } = setup();

    await waitFor(() => expect(relatedIds()).toHaveLength(3));

    const byType = store.getState().articleContent.byType;
    expect(byType[ArticleTypeEnum.NEWS].items).toEqual([]);
    expect(byType[ArticleTypeEnum.PROJECT].items).toEqual([]);
  });

  it('ignores a stale related-articles response that resolves after navigation', async () => {
    const forTen = deferred<any>();
    const forTwelve = deferred<any>();
    h.getAllArticle.mockImplementation(({ excludeArticleId }: any) =>
      excludeArticleId === 10 ? forTen.promise : forTwelve.promise,
    );
    const { rerender } = setup();

    h.params = { id: '12' };
    rerender();

    await act(async () => forTwelve.resolve(page([1, 2, 3])));
    await waitFor(() => expect(relatedIds()).toHaveLength(3));

    // The old request (which could include article 12 itself) lands last.
    await act(async () => forTen.resolve(page([12, 13, 14])));

    expect(relatedIds()).not.toContain('related-12');
    expect(relatedIds().sort()).toEqual(
      ['related-1', 'related-2', 'related-3'].sort(),
    );
  });

  it('clears the previous related set while the next article loads', async () => {
    h.getAllArticle.mockResolvedValueOnce(page([12, 13, 14]));
    const { rerender } = setup();
    await waitFor(() => expect(relatedIds()).toHaveLength(3));

    const pending = deferred<any>();
    h.getAllArticle.mockReturnValueOnce(pending.promise);
    h.params = { id: '12' };
    rerender();

    await waitFor(() =>
      expect(screen.getByText('Стаття 12')).toBeInTheDocument(),
    );
    expect(relatedIds()).toEqual([]);

    await act(async () => pending.resolve(page([1, 2, 3])));
    await waitFor(() => expect(relatedIds()).toHaveLength(3));
  });

  it('makes no related-articles request for an invalid id', async () => {
    h.params = { id: 'abc' };
    setup();

    expect(await screen.findByText('Invalid article ID')).toBeInTheDocument();
    expect(h.getAllArticle).not.toHaveBeenCalled();
    expect(h.getArticleById).not.toHaveBeenCalled();
    expect(h.toastError).not.toHaveBeenCalled();
  });

  it('fails silently when the optional related block cannot load', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    h.getAllArticle.mockRejectedValue(new Error('boom'));
    setup();

    expect(await screen.findByText('Стаття 10')).toBeInTheDocument();
    await waitFor(() => expect(h.getAllArticle).toHaveBeenCalled());
    await act(async () => {});

    expect(h.toastError).not.toHaveBeenCalled();
    expect(screen.queryByLabelText('related')).not.toBeInTheDocument();
    spy.mockRestore();
  });
});

describe('Article — main article loading', () => {
  beforeEach(() => {
    h.params = { id: '10' };
    h.locale = 'ua';
    h.getArticleById.mockImplementation(async (id: number) => articleDto(id));
    h.getAllArticle.mockResolvedValue(page([]));
  });
  afterEach(() => vi.clearAllMocks());

  it('re-maps the article when the locale changes', async () => {
    const { rerender } = setup();
    expect(await screen.findByText('Стаття 10')).toBeInTheDocument();

    h.locale = 'en';
    rerender();

    expect(await screen.findByText('Article 10')).toBeInTheDocument();
  });

  it('skips the client fetch when server data seeded the first paint', async () => {
    const store = configureStore({ reducer: rootReducer });
    render(
      <Provider store={store}>
        <Article
          articleType={ArticleTypeEnum.NEWS}
          initialArticleData={articleDto(10) as any}
        />
      </Provider>,
    );

    expect(screen.getByText('Стаття 10')).toBeInTheDocument();
    await act(async () => {});
    expect(h.getArticleById).not.toHaveBeenCalled();
  });
});
