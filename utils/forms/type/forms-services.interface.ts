import {
  BecomeParthnerRequestDTO,
  ContactRequestDTO,
  SubscribeRequestDTO,
} from './interfaces';

interface IFormsServices {
  becomeParthner: (data: BecomeParthnerRequestDTO) => void;
  sendContact: (data: ContactRequestDTO) => Promise<any>;
  createSubscribe: (data: SubscribeRequestDTO) => Promise<any>;
  confirmSubscribe: (token: string) => Promise<any>;
  confirmUnsubscribe: (id: string) => Promise<any>;
}

export default IFormsServices;
