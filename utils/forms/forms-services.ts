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

  async createSubscribe(email:  string) {
    return this.formServices.createSubscribe(email)
  }

  async confirmSubscribe(token:  string) {
    return this.formServices.confirmSubscribe(token)
  }
}


export default FormsServices;