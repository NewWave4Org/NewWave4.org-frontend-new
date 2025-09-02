interface IPhotoService {
    uploadPhoto: (params: {
        entityReferenceId: number;
        articleType: 'NEWS' | 'EVENT' | 'PROGRAM';
        file: File;
    }) => Promise<{ url: string }>;

    deletePhoto?: (photoId: number) => Promise<void>;
}

export { type IPhotoService };
