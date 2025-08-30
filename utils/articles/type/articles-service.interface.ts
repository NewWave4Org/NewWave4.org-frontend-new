import { Article, ArticleResponseDTO, ArticlesResponseDTO, ContentBlock, ContentBlockRequestDTO, NewArticleRequestDTO } from './interface';

interface IArticleService {
  getArticles: () => Promise<ArticlesResponseDTO>;
  createNewArticle: (data: NewArticleRequestDTO) => Promise<ArticleResponseDTO>;
  updateArticle: (id: number, data: NewArticleRequestDTO) => Promise<ArticleResponseDTO>;
  getArticleById: (params: { id: number }) => Promise<Article>;
  getArticleFullById: (id: number) => Promise<ArticleResponseDTO>;
  createContentBlock: (id: number, data: ContentBlockRequestDTO) => Promise<ContentBlock>;
  updateContentBlock: (id: number, data: ContentBlockRequestDTO) => Promise<ContentBlock>;
  deleteContentBlock: (id: number) => Promise<void>;
}

export { type IArticleService };
