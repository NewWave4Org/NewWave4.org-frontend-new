import { PagesType } from '@/components/admin/Pages/enum/types';

export interface IPagesResponseDTO {
  id: number;
  pageType: string;
  authorName: string;
  authorId: string;
  updatedAt: string;
  contentBlocks: any[] | null;
}

export interface IOurPartnersResponseDTO {
  id: number;
  key: string;
  pageType: PagesType[];
  contentBlocks: any[];
}

export interface IPagesRequestDTO {
  pageType: string;
  contentBlocks: any[];
}
