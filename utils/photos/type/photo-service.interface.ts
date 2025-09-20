import { ArticleType } from "@/utils/ArticleType";

interface IPhotoService {
    uploadPhoto: (params: {
        entityReferenceId: number;
        articleType: ArticleType;
        file: File;
    }) => Promise<{ url: string }>;

    deletePhoto?: (url: string) => Promise<void>;
}

export { type IPhotoService };
