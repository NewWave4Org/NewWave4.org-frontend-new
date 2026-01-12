interface ITranslationApi {
    translate: (id: number) => void;
    translatePage: (id: number) => void;
}

export {type ITranslationApi}