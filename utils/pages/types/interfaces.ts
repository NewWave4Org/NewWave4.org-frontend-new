export interface IPagesResponseDTO {
  id: number;
  pageType: string;
  authorName: string;
  authorId: number;
  createdAt: string;
  contentBlocks: any[];
}

export interface IPagesRequestDTO {
  pageType: string;
  contentBlocks: any[];
}
