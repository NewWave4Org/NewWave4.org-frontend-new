import GlobalSectionAPI from './global-sections-api';
import GlobalSectionService from './global-sections-services';

const globalSectionAPI = new GlobalSectionAPI();
const globalSectionService = new GlobalSectionService(globalSectionAPI);

export { globalSectionService };
