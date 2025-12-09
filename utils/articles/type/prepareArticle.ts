export interface ContentBlock {
    contentBlockType: string;
    data: any;
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
    const textBlock = article.contentBlocks.find(
        b => b.contentBlockType === 'MAIN_NEWS_BLOCK' || b.contentBlockType === 'TEXT'
    );

    const text = textBlock?.data ?? '';

    const photo = article.contentBlocks.find(
        b => b.contentBlockType === 'PHOTO' && b.data
    );

    const imageSrc = Array.isArray(photo?.data)
        ? photo.data[0]
        : typeof photo?.data === 'string'
            ? photo.data
            : '';

    return {
        id: article.id,
        title: article.title,
        text,
        imageSrc,
        publishedAt: article.publishedAt,
    };
};
