import { ContentBlockType } from "./contentBlockType";

export interface Article {
  id: number;
  articleType: string;
  authorId: number;
  authorName: string;
  relevantProjectId?: number;
  articleStatus: string;
  publishedAt: string | null;
  title: string;
  views: number;
}

export interface ContentBlock {
  id: number;
  contentBlockType: string;
  newsId: number;
  data: string;
  orderIndex: number;
}

export interface ArticlesResponseDTO {
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
  content: Article[];
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

export interface NewArticleRequestDTO {
  newsTitle: string;
  newsProjectTag: string;
}

export interface ArticleResponseDTO extends Article {
  contentBlocks: ContentBlock[];
}

export interface ContentBlockRequestDTO {
  contentBlockType: ContentBlockType,
  data: string,
  orderIndex: number
}

export interface ContentBlockArrayRequestDTO {
  contentBlockType: ContentBlockType,
  data: string[],
  orderIndex: number
}

export interface ArticleFull extends Article {
  mainPhoto: string,
  photoList: string[],
  photoSlider: string[],
  quote: string,
  mainText: string,
  textblock2: string,
  video: string,
}