import { BecomeParthnerRequestDTO } from "./interfaces";

interface IFormsAPI {
  becomeParthner: (data: BecomeParthnerRequestDTO) => void; 
  createSubscribe: (email: string) => Promise<any>;
  confirmSubscribe: (token: string) => Promise<any>;
}

export default IFormsAPI;