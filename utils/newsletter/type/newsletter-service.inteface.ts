import { NewsletterRequestDTO } from './interface';

interface INewsletterService {
  sendNewsletter: (data: NewsletterRequestDTO) => void;
  sendNewsletterTest: (data: NewsletterRequestDTO) => Promise<any>;
}

export type { INewsletterService };
