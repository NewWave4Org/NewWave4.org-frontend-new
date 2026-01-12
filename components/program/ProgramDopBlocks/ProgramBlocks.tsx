import { IArticleBody } from '@/utils/article-content/type/interfaces';
import ProgramBlockItem from './ProgramBlockItem';
import { prefix } from '@/utils/prefix';
import { useLocale, useTranslations } from 'next-intl';
import { EN_LOCALE } from '@/i18n';

function ProgramBlocks({ dopPrograms }: { dopPrograms: IArticleBody[] | null }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="program-block-dop lg:mt-[80px] mt-10">
      <div className="container mx-auto px-4">
        <h4 className="preheader !text-font-primary lg:mb-10 mb-6">{t('program_page.other_programs')}</h4>

        <div className="flex flex-col lg:flex-row -ml-3 -mr-3">
          {dopPrograms?.map(item => {
            const description = locale === EN_LOCALE 
              ? item?.contentBlocksEng?.find(item => item.contentBlockType === 'DESCRIPTION_PROGRAM')?.translatable_text_text 
              : item?.contentBlocks?.find(item => item.contentBlockType === 'DESCRIPTION_PROGRAM')?.translatable_text_text;

            const imageSrc = item?.contentBlocks?.find(item => item.contentBlockType === 'SECTION_WITH_PHOTO')?.files[0];
            const imgSrc = imageSrc !== undefined && imageSrc.length > 0 ? imageSrc : `${prefix}/logo.svg`;

            const title = locale === EN_LOCALE 
              ? item?.titleEng ?? item.title ?? ''
              : item?.title ?? item.titleEng ?? ''

            return <ProgramBlockItem key={item.id} title={title} description={description} id={item.id} imageSrc={imgSrc} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgramBlocks;
