import { IPagesRequestDTO, IPagesResponseDTO } from './interfaces';

interface IPagesServices {
  createdPages: (data: IPagesRequestDTO) => Promise<IPagesResponseDTO>;
  getPages: (pageType: string) => Promise<IPagesResponseDTO>;
  updatePages: (id: number, data: IPagesRequestDTO) => Promise<IPagesResponseDTO>;
}

export default IPagesServices;
