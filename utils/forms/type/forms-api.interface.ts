import { BecomeParthnerRequestDTO } from "./interfaces";

interface IFormsAPI {
  becomeParthner: (data: BecomeParthnerRequestDTO) => void; 
}

export default IFormsAPI;