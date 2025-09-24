import { ArticleType } from '@/utils/ArticleType';

export interface IArticleBody {
  title: string;
  articleType: ArticleType;
  articleStatus: string;
  authorName: string;
  authorId: string;
  views: number;
  publishedAt: string;
  contentBlocks: any[] | null;
  relevant_project_id?: number;
}

export interface GerArticleByIdResponseDTO {
  articleStatus: string;
  articleType: ArticleType;
  authorId: string;
  authorName: string;
  contentBlocks: any[] | null
  id: number;
  publishedAt: string | null
  title: string;
  views: number;
}

export interface CreateNewArticleRequestDTO {
  articleType: ArticleType,
  title: string,
  contentBlocks: any[] | null,
  relevantProjectId?: number 
}
export interface CreateNewArticleResponseDTO {
  id: number;
  title: string;
  articleType: ArticleType;
  articleStatus: string;
  authorName: string;
  authorId: string;
  views: number;
  publishedAt: string;
  contentBlocks: any[] | null;
  relevant_project_id: number;
}

export interface PublishArticleResponseDTO extends CreateNewArticleResponseDTO {}

export interface IGetAllArticleRequestDTO {
  page?: number;
  size?: number;
  articleType: ArticleType;
}

export interface IGetAllArticleResponseDTO {
  totalElements: number;
  totalPages: number;
  pageable: {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  content: any[] | null;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UpdateArticleRequestDTO {
  id: number;
  data: {
    title: string;
    articleType: ArticleType;
    contentBlocks: any[] | null;
    relevantProjectId?: number;
  } 
}
export interface UpdateArticleResponseDTO {
  title: string;
  contentBlocks: any[] | null;
  articleType: ArticleType;
}
