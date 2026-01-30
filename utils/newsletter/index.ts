import NewsletterAPI from "./newsletter-api";
import NewsletterService from "./newsletter-service";

const newsletterApi = new NewsletterAPI();
const newsletterService = new NewsletterService(newsletterApi);

export {newsletterService};