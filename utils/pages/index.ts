import PagesAPI from './pages-api';
import PagesServices from './pages-servics';

const pagesApi = new PagesAPI();
const pagesServices = new PagesServices(pagesApi);

export { pagesServices };
