import ArticleApi from './articles-api';
import ArticleService from './articles-service';

const articleApi = new ArticleApi();
const articleService = new ArticleService(articleApi);

export { articleService };
