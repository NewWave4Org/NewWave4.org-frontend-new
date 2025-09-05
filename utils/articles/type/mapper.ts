import { ArticleFull, ArticleResponseDTO } from "@/utils/articles/type/interface";
import { ContentBlockType } from "@/utils/articles/type/contentBlockType";

export function mapArticleResponseToFull(dto: ArticleResponseDTO): ArticleFull {
    return {
        ...dto,
        mainPhoto:
            dto.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.PHOTO,
            )?.data || "",
        photoList: (() => {
            const data = dto.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.PHOTOS_LIST,
            )?.data;
            return Array.isArray(data) ? data : [];
        })(),
        photoSlider: (() => {
            const data = dto.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.PHOTOS_SLIDER,
            )?.data;
            return Array.isArray(data) ? data : [];
        })(),
        quote:
            dto.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.QUOTE,
            )?.data || "",
        mainText:
            dto.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.MAIN_NEWS_BLOCK,
            )?.data || "",
        textblock2:
            dto.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.TEXT,
            )?.data || "",
        video:
            dto.contentBlocks?.find(
                b => b.contentBlockType === ContentBlockType.VIDEO,
            )?.data || "",
    };
}
