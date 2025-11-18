import IGlobalSectionsAPI from './type/global-sections-api.interface';
import IGlobalSectionsServices from './type/global-sections-services.interface';
import { IGlobalSectionRequestPutDTO, IGlobalSectionsRequestDTO } from './type/interfaces';

class GlobalSectionService implements IGlobalSectionsServices {
  private globalSection: IGlobalSectionsAPI;

  constructor(globalSection: IGlobalSectionsAPI) {
    this.globalSection = globalSection;
  }

  async createdGlobalSections(data: IGlobalSectionsRequestDTO) {
    return this.globalSection.createdGlobalSections(data);
  }

  async getAllGlobalSections() {
    return this.globalSection.getAllGlobalSections();
  }

  async getGlobalSectionByKey(key: string) {
    return this.globalSection.getGlobalSectionByKey(key);
  }

  async updateGlobalSection(id: number, data: IGlobalSectionRequestPutDTO) {
    return this.globalSection.updateGlobalSection(id, data);
  }
}

export default GlobalSectionService;
