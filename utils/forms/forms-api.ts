import { ApiEndpoint } from '../http/enums/api-endpoint';
import HttpMethod from '../http/enums/http-method';
import { requestPublic } from '../http/http-request-service';
import IFormsAPI from './type/forms-api.interface';
import { BecomeParthnerRequestDTO } from './type/interfaces';

class FormsAPI implements IFormsAPI {
  async becomeParthner(data: BecomeParthnerRequestDTO) {
    return requestPublic({
      method: HttpMethod.POST,
      url: ApiEndpoint.BECOME_PARTHNER,
      body: data,
    });
  }

  async createSubscribe(email: string) {
    return requestPublic({
      method: HttpMethod.POST,
      url: ApiEndpoint.CREATE_SUBSCRIBE,
      body: email,
    });
  }

  async confirmSubscribe(token: string) {
    return requestPublic({
      method: HttpMethod.POST,
      url: ApiEndpoint.CONFIRM_SUBSCRIBE,
      body: token,
    });
  }

  async confirmUnsubscribe(id: string) {
    return requestPublic({
      method: HttpMethod.PATCH,
      url: ApiEndpoint.CONFIRM_UNSUBSCRIBE,
      params: { id },
    });
  }
}

export default FormsAPI;
