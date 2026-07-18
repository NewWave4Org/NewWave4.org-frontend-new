import { cache } from 'react';
import { articleContentService } from '@/utils/article-content';

/**
 * Wraps getArticleById in React's request-scoped cache so generateMetadata and
 * the page component can both ask for the same article within one request
 * without firing the fetch twice.
 */
export const getArticleByIdCached = cache((id: number) => articleContentService.getArticleById(id));
