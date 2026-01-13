import IFormsServices from "./type/forms-services.interface";
import { BecomeParthnerRequestDTO } from "./type/interfaces";

class FormsServices implements IFormsServices {
  private formServices: IFormsServices;

  constructor(formServices: IFormsServices) {
    this.formServices = formServices;
  }

  async becomeParthner(data: BecomeParthnerRequestDTO) {
    return this.formServices.becomeParthner(data)
  }

}


export default FormsServices;