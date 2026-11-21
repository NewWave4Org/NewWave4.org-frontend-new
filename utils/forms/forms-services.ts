import IFormsServices from './type/forms-services.interface';
import {
  BecomeParthnerRequestDTO,
  ContactRequestDTO,
  SubscribeRequestDTO,
} from './type/interfaces';

class FormsServices implements IFormsServices {
  private formServices: IFormsServices;

  constructor(formServices: IFormsServices) {
    this.formServices = formServices;
  }

  async becomeParthner(data: BecomeParthnerRequestDTO) {
    return this.formServices.becomeParthner(data);
  }

  async sendContact(data: ContactRequestDTO) {
    return this.formServices.sendContact(data);
  }

  async createSubscribe(data: SubscribeRequestDTO) {
    return this.formServices.createSubscribe(data);
  }

  async confirmSubscribe(token: string) {
    return this.formServices.confirmSubscribe(token);
  }

  async confirmUnsubscribe(id: string) {
    return this.formServices.confirmUnsubscribe(id);
  }
}

export default FormsServices;
