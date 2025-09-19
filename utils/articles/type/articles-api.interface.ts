import { Article, ArticleResponseDTO, ArticlesResponseDTO, ContentBlock, ContentBlockArrayRequestDTO, ContentBlockRequestDTO, NewArticleRequestDTO, PublishArticleRequestDTO } from './interface';

interface IArticleApi {
  getArticles: (params: { page: number }) => Promise<ArticlesResponseDTO>;
  createNewArticle: (data: NewArticleRequestDTO) => Promise<ArticleResponseDTO>;
  updateArticle: (id: number, data: NewArticleRequestDTO) => Promise<ArticleResponseDTO>;
  deleteArticle: (id: number) => Promise<void>;
  getArticleById: (params: { id: number }) => Promise<Article>;
  getArticleFullById: (id: number) => Promise<ArticleResponseDTO>;
  createContentBlock: (articleId: number, data: ContentBlockRequestDTO) => Promise<ContentBlock>;
  updateContentBlock: (id: number, data: ContentBlockRequestDTO) => Promise<ContentBlock>;
  deleteContentBlock: (id: number) => Promise<void>;
  createContentBlockArray: (articleId: number, data: ContentBlockArrayRequestDTO) => Promise<ContentBlock>;
  updateContentBlockArray: (id: number, data: ContentBlockArrayRequestDTO) => Promise<ContentBlock>;
  publishArticle: (id: number, data: PublishArticleRequestDTO) => Promise<ArticleResponseDTO>;
}

export { type IArticleApi };