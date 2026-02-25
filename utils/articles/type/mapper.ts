import { ArticleFull } from "@/utils/articles/type/interface";
import { ContentBlockType } from "@/utils/articles/type/contentBlockType";
import { GetArticleByIdResponseDTO } from "@/utils/article-content/type/interfaces";
import { getBlockValue } from "./prepareArticle";
import { EN_LOCALE } from "@/i18n";


export function mapGetArticleByIdResponseToFull(
    dto: GetArticleByIdResponseDTO,
    locale: string = 'ua'
): ArticleFull {
    const isEng = EN_LOCALE;
    const blocks = isEng && dto.contentBlocksEng ? dto.contentBlocksEng : (dto.contentBlocks ?? []);
    const title = isEng && dto.titleEng ? dto.titleEng : dto.title;

    return {
        ...dto,
        title,
        mainPhoto: (() => {
            const data = getBlockValue<string | string[]>(
                blocks,
                ContentBlockType.PHOTO
            );
            return Array.isArray(data) ? data[0] ?? "" : data ?? "";
        })(),
        photoList:
            getBlockValue<string[]>(blocks, ContentBlockType.PHOTOS_LIST) ?? [],
        photoSlider:
            getBlockValue<string[]>(blocks, ContentBlockType.PHOTOS_SLIDER) ?? [],
        quote:
            getBlockValue<string>(blocks, ContentBlockType.QUOTE) ?? "",
        mainText:
            getBlockValue<string>(blocks, ContentBlockType.MAIN_NEWS_BLOCK) ?? "",
        textblock2:
            getBlockValue<string>(blocks, ContentBlockType.TEXT) ?? "",
        video:
            getBlockValue<string>(blocks, ContentBlockType.VIDEO) ?? "",
    };
}

