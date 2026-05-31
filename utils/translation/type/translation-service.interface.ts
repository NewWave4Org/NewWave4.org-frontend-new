interface ITranslateService {
    translate: ({id, translateFrom }: {id: number, translateFrom: string}) => void;
    translatePage: (id: number) => void;
}

export {type ITranslateService};