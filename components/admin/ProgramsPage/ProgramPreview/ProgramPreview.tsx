'use client';

import ProgramBlocksWithPhotos from '@/components/program/programPageComponents/ProgramBlocksWithPhotos';
import ProgramBlocksWithText from '@/components/program/programPageComponents/ProgramBlocksWithText';
import ProgramFirstBlocks from '@/components/program/programPageComponents/ProgramFirstBlocks';
import ProgramHeader from '@/components/program/programPageComponents/ProgramHeader';
import ProgramSchedule from '@/components/program/programPageComponents/ProgramSchedule';
import { EN_LOCALE } from '@/i18n';
import { ChangedArticleByIdBody } from '@/utils/article-content/type/interfaces';
import { convertYoutubeUrlToEmbed } from '@/utils/videoUtils';
import { useLocale, useTranslations } from 'next-intl';

function ProgramPreview({ program }: { program: ChangedArticleByIdBody | undefined }) {

  const t = useTranslations();
  const locale = useLocale();

  const programData = {
    ...program,
    titleToShow: locale === EN_LOCALE ? program?.titleEng : program?.title,
    contentBlocksToShow: locale === EN_LOCALE ? program?.contentBlocksEng : program?.contentBlocks
  };

  const titleProgram = programData?.titleToShow;
  const pageBanner = programData?.contentBlocksToShow?.find(item => item.contentBlockType === 'PAGE_BANNER')?.files;
  const dateProgram = programData?.contentBlocksToShow?.find(item => item.contentBlockType === 'DATE_PROGRAM')?.date;
  const descriptionProgram = programData?.contentBlocksToShow?.find(item => item.contentBlockType === 'DESCRIPTION_PROGRAM')?.translatable_text_editorState;

  const blocksWithPhoto = programData?.contentBlocksToShow?.filter(item => item.contentBlockType === 'SECTION_WITH_PHOTO');
  const filteredBlocksWithPhoto = blocksWithPhoto?.filter(item => {
    return item.translatable_text_sectionTitle !== '' || item.translatable_text_text !== '' || item.files.length > 0;
  });

  const blocksWithText = programData?.contentBlocksToShow?.filter(item => item.contentBlockType === 'SECTION_WITH_TEXT');
  const filteredBlocksWithText = blocksWithText?.filter(item => {
    return item.translatable_text_sectionTitle !== '' || item.translatable_text_text1 !== '' || item.translatable_text_text2 !== '';
  });

  const videoURL = programData?.contentBlocksToShow?.find(item => item.contentBlockType === 'VIDEO')?.videoUrl;
  const videoLink = convertYoutubeUrlToEmbed(videoURL!);

  const schedulePoster = programData?.contentBlocksToShow?.find(item => item.contentBlockType === 'SCHEDULE_POSTER')?.files;
  const scheduleTitle = programData?.contentBlocksToShow?.find(item => item.contentBlockType === 'SCHEDULE_TITLE')?.translatable_text_title;

  const scheduleInfo = programData?.contentBlocksToShow?.filter(item => item.contentBlockType === 'SCHEDULE_INFO');
  const filteredScheduleInfo = scheduleInfo?.filter(item => {
    return item.location !== '' || item.translatable_text_title !== '';
  });

  return (
    <>
      <ProgramHeader title={t('program_page.title')} pageBanner={pageBanner} classNameParent="!mb-0" />
      <div className="">
        {(titleProgram || descriptionProgram) && (
          <ProgramFirstBlocks
            title={titleProgram}
            description={descriptionProgram}
            dateProgram={dateProgram}
          />
        )}
        <div className="lg:mt-20 mt-10">
          {filteredBlocksWithPhoto && filteredBlocksWithPhoto.length > 0 && (
            <ProgramBlocksWithPhotos contentBlock={filteredBlocksWithPhoto} />
          )}
          {filteredBlocksWithText && filteredBlocksWithText?.length > 0 && (
            <ProgramBlocksWithText contentBlock={filteredBlocksWithText} />
          )}
          {filteredScheduleInfo && filteredScheduleInfo.length > 0 && (
            <ProgramSchedule
              schedulePoster={schedulePoster}
              scheduleTitle={scheduleTitle}
              scheduleInfo={filteredScheduleInfo}
            />
          )}

          {videoLink && (
            <div className="lg:mb-20 mb-10">
              <div className="container mx-auto px-4">
                <iframe
                  src={videoLink}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-2xl w-full lg:h-[640px] sm:h-auto aspect-video"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProgramPreview;
