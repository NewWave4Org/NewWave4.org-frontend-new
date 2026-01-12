interface ITranslateService {
    translate: (id: number) => void;
    translatePage: (id: number) => void;
}

export {type ITranslateService}