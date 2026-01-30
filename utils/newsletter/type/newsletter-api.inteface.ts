import { NewsletterRequestDTO } from "./interface";

interface INewsletterAPI {
  sendNewsletter: (data: NewsletterRequestDTO) => void;
}

export type {INewsletterAPI};