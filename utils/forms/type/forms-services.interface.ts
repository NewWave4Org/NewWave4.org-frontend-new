import { BecomeParthnerRequestDTO } from "./interfaces";

interface IFormsServices {
  becomeParthner: (data: BecomeParthnerRequestDTO) => void; 
}

export default IFormsServices;