import { IPagesRequestDTO } from './types/interfaces';
import IPagesAPI from './types/pages-api.interface';
import IPagesServices from './types/pages-services.interface';

class PagesServices implements IPagesServices {
  private pages: IPagesAPI;

  constructor(pages: IPagesAPI) {
    this.pages = pages;
  }

  async createdPages(data: IPagesRequestDTO) {
    return this.pages.createdPages(data);
  }

  async getPages(pageType: string) {
    return this.pages.getPages(pageType);
  }

  async updatePages(id: number, data: IPagesRequestDTO) {
    return this.pages.updatePages(id, data);
  }
}

export default PagesServices;
