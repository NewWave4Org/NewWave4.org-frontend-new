export interface IGlobalSectionsResponseDTO {
  id: number;
  key: string;
  title: string;
  contentBlocks: any[];
}

export interface IGlobalSectionsRequestDTO {
  key: string;
  title: string;
  contentBlocks: any[];
}

export interface IGlobalSectionRequestPutDTO {
  title: string;
  contentBlocks: any[];
}
