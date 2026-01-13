import { ApiEndpoint } from "../http/enums/api-endpoint";
import HttpMethod from "../http/enums/http-method";
import { request } from "../http/http-request-service";
import IFormsAPI from "./type/forms-api.interface";
import { BecomeParthnerRequestDTO } from "./type/interfaces";

class FormsAPI implements IFormsAPI {
  async becomeParthner(data: BecomeParthnerRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.BECOME_PARTHNER,
      body: data
    })
  }
}


export default FormsAPI;