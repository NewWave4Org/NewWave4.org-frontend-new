import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';

export interface Article {
  id: number;
  articleType: string;
  authorId: number;
  authorName: string;
  relevantProjectId?: number;
  articleStatus: string;
  publishedAt: string | null;
  createdAt: string | null;
  dateOfWriting: string | null;
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

// What mapGetArticleByIdResponseToFull actually returns: the response DTO
// spread whole, plus the blocks it flattens out of contentBlocks. It used to
// extend `Article`, which claimed a required `authorId` the DTO does not carry
// (commented out there) and omitted `contentBlocks`, which the spread does
// carry — so the producer and both consumers each disagreed with the type.
// news/Article.tsx was already patching around it with an intersection.
export type ArticleFull = GetArticleByIdResponseDTO & {
  mainPhoto: string;
  photoList: string[];
  photoSlider: string[];
  quote: string;
  mainText: string;
  textblock2: string;
  video: string;
};
