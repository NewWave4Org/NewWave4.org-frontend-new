import { BecomeParthnerRequestDTO } from "./interfaces";

interface IFormsServices {
  becomeParthner: (data: BecomeParthnerRequestDTO) => void; 
  createSubscribe: (email: string) => Promise<any>;
  confirmSubscribe: (token: string) => Promise<any>;
}

export default IFormsServices;