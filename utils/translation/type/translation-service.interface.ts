interface ITranslateService {
    translate: ({id, translateFrom }: {id: number, translateFrom: string}) => void;
    translatePage: ({id, translateFrom }: {id: number, translateFrom: string}) => void;
}

export {type ITranslateService};