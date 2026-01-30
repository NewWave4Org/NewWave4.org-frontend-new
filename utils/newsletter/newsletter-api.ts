import { ApiEndpoint } from "../http/enums/api-endpoint";
import HttpMethod from "../http/enums/http-method";
import { request } from "../http/http-request-service";
import { NewsletterRequestDTO } from "./type/interface";
import { INewsletterAPI } from "./type/newsletter-api.inteface";

class NewsletterAPI implements INewsletterAPI {
  async sendNewsletter(data: NewsletterRequestDTO) {
    return request({
      method: HttpMethod.POST,
      url: ApiEndpoint.NEWSLETTER,
      body: data
    });
  }
}

export default NewsletterAPI;