import { describe, expect, it, vi } from 'vitest';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { fetchRelatedArticles } from './related-articles';

const art = (id: number) => ({ id }) as any;
const pageOf = (ids: number[], totalElements: number) =>
  ({ content: ids.map(art), totalElements }) as any;

// random() always 0 -> shuffle becomes a fixed permutation, page pick = 0.
const zero = () => 0;
const ids = (items: { id: number }[]) => items.map(i => i.id).sort();

describe('fetchRelatedArticles', () => {
  it('requests only `count` published articles of the type, excluding the current one', async () => {
    const getAllArticle = vi.fn().mockResolvedValue(pageOf([1, 2, 3], 3));

    await fetchRelatedArticles({
      articleType: ArticleTypeEnum.NEWS,
      excludeArticleId: 10,
      service: { getAllArticle },
      random: zero,
    });

    expect(getAllArticle).toHaveBeenCalledTimes(1);
    expect(getAllArticle).toHaveBeenCalledWith({
      page: 0,
      size: 3,
      articleType: ArticleTypeEnum.NEWS,
      articleStatus: ArticleStatusEnum.PUBLISHED,
      excludeArticleId: 10,
    });
  });

  it('can reach articles beyond the first page by picking a random full page', async () => {
    // 30 articles -> 10 full pages of 3. random() = 0.95 -> page 9.
    const getAllArticle = vi
      .fn()
      .mockResolvedValueOnce(pageOf([1, 2, 3], 30))
      .mockResolvedValueOnce(pageOf([28, 29, 30], 30));

    const result = await fetchRelatedArticles({
      articleType: ArticleTypeEnum.EVENT,
      excludeArticleId: 5,
      service: { getAllArticle },
      random: () => 0.95,
    });

    expect(getAllArticle).toHaveBeenCalledTimes(2);
    expect(getAllArticle.mock.calls[1][0]).toMatchObject({ page: 9, size: 3 });
    expect(ids(result)).toEqual([28, 29, 30].sort());
  });

  it('reuses the first page instead of refetching when page 0 is picked', async () => {
    const getAllArticle = vi.fn().mockResolvedValue(pageOf([1, 2, 3], 30));

    const result = await fetchRelatedArticles({
      articleType: ArticleTypeEnum.NEWS,
      excludeArticleId: 5,
      service: { getAllArticle },
      random: zero,
    });

    expect(getAllArticle).toHaveBeenCalledTimes(1);
    expect(ids(result)).toEqual([1, 2, 3].sort());
  });

  it('returns what exists when there are fewer than `count` articles', async () => {
    const getAllArticle = vi.fn().mockResolvedValue(pageOf([4], 1));

    const result = await fetchRelatedArticles({
      articleType: ArticleTypeEnum.NEWS,
      excludeArticleId: 5,
      service: { getAllArticle },
      random: zero,
    });

    expect(getAllArticle).toHaveBeenCalledTimes(1);
    expect(ids(result)).toEqual([4]);
  });

  it('tolerates a response with no content', async () => {
    const getAllArticle = vi.fn().mockResolvedValue({});

    const result = await fetchRelatedArticles({
      articleType: ArticleTypeEnum.NEWS,
      excludeArticleId: 5,
      service: { getAllArticle },
    });

    expect(result).toEqual([]);
  });
});
