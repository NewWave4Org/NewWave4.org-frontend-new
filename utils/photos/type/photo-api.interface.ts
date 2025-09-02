interface IPhotoApi {
    uploadPhoto: (params: {
        entityReferenceId: number;
        articleType: 'NEWS' | 'EVENT' | 'PROGRAM';
        file: File;
    }) => Promise<string>;

    deletePhoto?: (url: string) => Promise<void>;
}

export { type IPhotoApi };