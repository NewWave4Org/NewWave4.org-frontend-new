import { ITranslationApi } from "./type/translation-api.interface";
import { ITranslateService } from "./type/translation-service.interface";

class TranslationServices implements ITranslateService {
    private translateVal: ITranslationApi;

    constructor(translateVal: ITranslationApi) {
        this.translateVal = translateVal
    }

    async translate(id: number) {
        return this.translateVal.translate(id)
    }
}

export default TranslationServices;