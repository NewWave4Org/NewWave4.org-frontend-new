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
    titleEng?: string;
    contentBlocks: ContentBlock[];
    contentBlocksEng?: ContentBlock[];
    publishedAt: string;
}

export interface PreparedArticle {
    id: number;
    title: string;
    text: string;
    imageSrc: string;
    publishedAt: string;
}
export const prepareArticle = (article: Article, locale: string = 'ua'): PreparedArticle => {
    const isEng = locale === 'en';
    const blocks = isEng && article.contentBlocksEng ? article.contentBlocksEng : article.contentBlocks;
    const title = isEng && article.titleEng ? article.titleEng : article.title;

    const text =
        getBlockValue<string>(blocks, ContentBlockType.MAIN_NEWS_BLOCK) ??
        getBlockValue<string>(blocks, ContentBlockType.TEXT) ??
        "";

    const photoData = getBlockValue<string | string[]>(
        blocks,
        ContentBlockType.PHOTO
    );

    const imageSrc = Array.isArray(photoData)
        ? photoData[0] ?? ""
        : photoData ?? "";

    return {
        id: article.id,
        title,
        text,
        imageSrc,
        publishedAt: article.publishedAt,
    };
};