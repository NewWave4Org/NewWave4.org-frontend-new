import { ArticleFull } from "@/utils/articles/type/interface";
import { ContentBlockType } from "@/utils/articles/type/contentBlockType";
import { GetArticleByIdResponseDTO } from "@/utils/article-content/type/interfaces";

export function mapGetArticleByIdResponseToFull(dto: GetArticleByIdResponseDTO): ArticleFull {
    const getBlockData = (type: ContentBlockType) =>
        dto.contentBlocks?.find(b => b.contentBlockType === type)?.data;

    const mainPhotoData = getBlockData(ContentBlockType.PHOTO);
    const photoListData = getBlockData(ContentBlockType.PHOTOS_LIST);
    const photoSliderData = getBlockData(ContentBlockType.PHOTOS_SLIDER);
    const quoteData = getBlockData(ContentBlockType.QUOTE);
    const mainTextData = getBlockData(ContentBlockType.MAIN_NEWS_BLOCK);
    const textBlock2Data = getBlockData(ContentBlockType.TEXT);
    const videoData = getBlockData(ContentBlockType.VIDEO);

    return {
        ...dto,
        mainPhoto: Array.isArray(mainPhotoData)
            ? mainPhotoData[0] || ""
            : typeof mainPhotoData === "string"
                ? mainPhotoData
                : "",
        photoList: Array.isArray(photoListData) ? photoListData : [],
        photoSlider: Array.isArray(photoSliderData) ? photoSliderData : [],
        quote: typeof quoteData === "string" ? quoteData : "",
        mainText: typeof mainTextData === "string" ? mainTextData : "",
        textblock2: typeof textBlock2Data === "string" ? textBlock2Data : "",
        video: typeof videoData === "string" ? videoData : "",
    };
}
