import ArticleApi from './article-content-api';
import ArticleService from './article-content-service';

const articleContentApi = new ArticleApi();
const articleContentService = new ArticleService(articleContentApi);

export { articleContentService };
