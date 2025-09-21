import { ArticleType } from "@/utils/ArticleType";

interface IPhotoApi {
    uploadPhoto: (params: {
        entityReferenceId: number;
        articleType: ArticleType;
        file: File;
    }) => Promise<string>;

    deletePhoto: (url: string) => Promise<void>;
}

export { type IPhotoApi };