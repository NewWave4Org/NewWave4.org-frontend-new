interface IPhotoService {
    uploadPhoto: (params: {
        entityReferenceId: number;
        articleType: 'NEWS' | 'EVENT' | 'PROGRAM';
        file: File;
    }) => Promise<{ url: string }>;

    deletePhoto?: (url: string) => Promise<void>;
}

export { type IPhotoService };
