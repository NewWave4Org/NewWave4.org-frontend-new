import { ApiEndpoint } from "../http/enums/api-endpoint";
import HttpMethod from "../http/enums/http-method";
import { request } from "../http/http-request-service";
import { IDonationApi } from "./type/donation-api.interface";
import { IDonationRequestDTO, IDonationResponseDTO } from "./type/interface";

class DonationApi implements IDonationApi {
  async getAllDonations(params: IDonationRequestDTO): Promise<IDonationResponseDTO> {
    return request({
      method: HttpMethod.GET,
      url: ApiEndpoint.GET_ALL_DONATION,
      params
    });
  }
}

export default DonationApi;