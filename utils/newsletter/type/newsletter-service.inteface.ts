import { NewsletterRequestDTO } from "./interface";

interface INewsletterService {
  sendNewsletter: (data: NewsletterRequestDTO) => void;
}

export type {INewsletterService};