import TranslationApi from "./translation-api";
import TranslationServices from "./translation-service";

const translateApi = new TranslationApi();
const translateService = new TranslationServices(translateApi)

export {translateService}