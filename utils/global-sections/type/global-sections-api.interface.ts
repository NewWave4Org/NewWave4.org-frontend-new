import { IGlobalSectionRequestPutDTO, IGlobalSectionsRequestDTO, IGlobalSectionsResponseDTO } from './interfaces';

interface IGlobalSectionsAPI {
  createdGlobalSections: (data: IGlobalSectionsRequestDTO) => Promise<IGlobalSectionsResponseDTO>;
  getAllGlobalSections: () => Promise<IGlobalSectionsResponseDTO[]>;
  getGlobalSectionByKey: (key: string) => Promise<IGlobalSectionsResponseDTO>;
  updateGlobalSection: (id: number, data: IGlobalSectionRequestPutDTO) => Promise<IGlobalSectionsResponseDTO>;
}

export default IGlobalSectionsAPI;
