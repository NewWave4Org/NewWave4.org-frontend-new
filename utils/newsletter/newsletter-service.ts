import { NewsletterRequestDTO } from "./type/interface";
import { INewsletterAPI } from "./type/newsletter-api.inteface";
import { INewsletterService } from "./type/newsletter-service.inteface";

class NewsletterService implements INewsletterService {
  private newsletter: INewsletterAPI;

  constructor(newsletter: INewsletterAPI) {
    this.newsletter = newsletter;
  }

  async sendNewsletter(data: NewsletterRequestDTO) {
    return this.newsletter.sendNewsletter(data);
  }
}

export default NewsletterService;