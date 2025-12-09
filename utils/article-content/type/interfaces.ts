import { ArticleStatus, ArticleType } from '@/utils/ArticleType';

export interface IArticleBody {
  id: number;
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

export interface GetArticleByIdResponseDTO {
  articleStatus: string;
  articleType: ArticleType;
  authorId: number;
  authorName: string;
  contentBlocks: any[] | null;
  id: number;
  publishedAt: string | null;
  createdAt: string;
  title: string;
  views: number;
  relevantProjectId?: number;
  dateOfWriting: string;
}

export interface CreateNewArticleRequestDTO {
  articleType: ArticleType;
  title: string;
  contentBlocks: any[] | null;
  relevantProjectId?: number;
  authorId?: number;
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

export interface IGetAllArticleRequestDTO {
  page?: number;
  size?: number;
  articleType?: ArticleType;
  articleStatus?: ArticleStatus | string;
  relevantProjectId?: number | null;
  sortByStatus?: boolean;
  sortByCreatedAtDescending?: boolean;
  excludeArticleId?: number;
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
    authorId?: number;
    contentBlocks: any[] | null;
    relevantProjectId?: number;
    dateOfWriting?: any;
  };
}
export interface UpdateArticleResponseDTO {
  title: string;
  contentBlocks: any[] | null;
  articleType: ArticleType;
}
