import { ApiEndpoint } from "../http/enums/api-endpoint";
import HttpMethod from "../http/enums/http-method";
import { request } from "../http/http-request-service";
import { ITranslationApi } from "./type/translation-api.interface";

class TranslationApi implements ITranslationApi {
    async translate({id, translateFrom }: {id: number, translateFrom: string}) {
        return request({
            method: HttpMethod.PUT,
            url: ApiEndpoint.TRANSLATION(id),
            params: {translateDirection: translateFrom}
        });
    }

    async translatePage(id: number) {
        return request({
            method: HttpMethod.PUT,
            url: ApiEndpoint.TRANSLATION_PAGE(id),
        });
    }
}

export default TranslationApi;