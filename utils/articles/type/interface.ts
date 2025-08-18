export interface Article {
  id: number;
  articleType: string;
  authorId: string;
  authorName: string;
  newsProjectTag: string;
  newsStatus: string;
  previewDescription: string | null;
  previewImageUrl: string | null;
  publishedAt: string | null;
  title: string;
  views: number;
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
