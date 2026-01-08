import { ApiEndpoint } from "../http/enums/api-endpoint";
import HttpMethod from "../http/enums/http-method";
import { request } from "../http/http-request-service";
import { ITranslationApi } from "./type/translation-api.interface";

class TranslationApi implements ITranslationApi {
    async translate(id: number) {
        return request({
            method: HttpMethod.PUT,
            url: ApiEndpoint.TRANSLATION(id)
        })
    }
}

export default TranslationApi;