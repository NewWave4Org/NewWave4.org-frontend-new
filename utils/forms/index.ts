import FormsAPI from "./forms-api";
import FormsServices from "./forms-services";

const fromsApi = new FormsAPI();
const formsServices = new FormsServices(fromsApi);

export {formsServices}