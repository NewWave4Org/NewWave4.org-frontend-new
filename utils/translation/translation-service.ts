import { ITranslationApi } from "./type/translation-api.interface";
import { ITranslateService } from "./type/translation-service.interface";

class TranslationServices implements ITranslateService {
    private translateVal: ITranslationApi;

    constructor(translateVal: ITranslationApi) {
        this.translateVal = translateVal;
    }

    async translate({id, translateFrom }: {id: number, translateFrom: string}) {
        return this.translateVal.translate({id, translateFrom});
    }

    async translatePage(id: number) {
        return this.translateVal.translatePage(id);
    }
}

export default TranslationServices;