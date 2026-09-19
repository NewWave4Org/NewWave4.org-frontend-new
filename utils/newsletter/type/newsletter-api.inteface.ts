import { NewsletterRequestDTO } from './interface';

interface INewsletterAPI {
  sendNewsletter: (data: NewsletterRequestDTO) => void;
  sendNewsletterTest: (data: NewsletterRequestDTO) => Promise<any>;
}

export type { INewsletterAPI };
