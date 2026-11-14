import { shuffle } from '@/utils/array/shuffle';
import { ArticleStatusEnum, ArticleType } from '@/utils/ArticleType';
import { articleContentService } from '.';
import { IArticleBody, IGetAllArticleRequestDTO } from './type/interfaces';

type RelatedArticlesSource = {
  getAllArticle: typeof articleContentService.getAllArticle;
};

/**
 * Picks `count` published articles of `articleType` (other than
 * `excludeArticleId`) for the "Other news / Other events" block.
 *
 * The list endpoint has no random-sample option, so instead of downloading a
 * big page and throwing most of it away, this fetches one page of `count`
 * (which also yields `totalElements`), picks a random full page across the
 * whole collection, fetches it if it isn't page 0, and shuffles it. At most
 * two requests of `count` items, and every article can be reached, not just
 * the newest ones.
 *
 * It calls the service directly on purpose: going through the `getAllArticle`
 * thunk would overwrite the shared `articleContent.byType` list in Redux.
 */
export async function fetchRelatedArticles({
  articleType,
  excludeArticleId,
  count = 3,
  random = Math.random,
  service = articleContentService,
}: {
  articleType?: ArticleType;
  excludeArticleId: number;
  count?: number;
  random?: () => number;
  service?: RelatedArticlesSource;
}): Promise<IArticleBody[]> {
  const query = (page: number): IGetAllArticleRequestDTO => ({
    page,
    size: count,
    articleType,
    articleStatus: ArticleStatusEnum.PUBLISHED,
    excludeArticleId,
  });

  const first = await service.getAllArticle(query(0));
  const fullPages = Math.floor((first?.totalElements ?? 0) / count);
  const pick = fullPages > 1 ? Math.floor(random() * fullPages) : 0;

  const chosen = pick === 0 ? first : await service.getAllArticle(query(pick));

  return shuffle(chosen?.content ?? [], random).slice(0, count);
}
