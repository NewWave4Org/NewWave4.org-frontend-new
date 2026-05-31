interface ITranslationApi {
    translate: ({id, translateFrom }: {id: number, translateFrom: string}) => void;
    translatePage: (id: number) => void;
}

export {type ITranslationApi};