import { ContentBlockType } from "@/utils/articles/type/contentBlockType";

export interface ContentBlock<T = unknown> {
    contentBlockType: ContentBlockType | string;
    translatable_text_data?: T;
    data?: T;
}

export function getBlockValue<T>(
    blocks: ContentBlock[],
    type: ContentBlockType
): T | undefined {
    const block = blocks.find(b => b.contentBlockType === type);
    return (block?.translatable_text_data ?? block?.data) as T | undefined;
}


export interface Article {
    id: number;
    title: string;
    contentBlocks: ContentBlock[];
    publishedAt: string;
}

export interface PreparedArticle {
    id: number;
    title: string;
    text: string;
    imageSrc: string;
    publishedAt: string;
}
export const prepareArticle = (article: Article): PreparedArticle => {
    const text =
        getBlockValue<string>(article.contentBlocks, ContentBlockType.MAIN_NEWS_BLOCK) ??
        getBlockValue<string>(article.contentBlocks, ContentBlockType.TEXT) ??
        "";

    const photoData = getBlockValue<string | string[]>(
        article.contentBlocks,
        ContentBlockType.PHOTO
    );

    const imageSrc = Array.isArray(photoData)
        ? photoData[0] ?? ""
        : photoData ?? "";

    return {
        id: article.id,
        title: article.title,
        text,
        imageSrc,
        publishedAt: article.publishedAt,
    };
};