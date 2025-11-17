import { IGlobalSectionsRequestDTO, IGlobalSectionsResponseDTO } from './interfaces';

interface IGlobalSectionsServices {
  createdGlobalSections: (data: IGlobalSectionsRequestDTO) => Promise<IGlobalSectionsResponseDTO>;
  getAllGlobalSections: () => Promise<IGlobalSectionsResponseDTO[]>;
  getGlobalSectionByKey: (key: string) => Promise<IGlobalSectionsResponseDTO>;
}

export default IGlobalSectionsServices;
