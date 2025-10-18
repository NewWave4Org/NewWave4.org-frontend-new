'use client';

import ProgramBlocksWithPhotos from '@/components/program/programPageComponents/ProgramBlocksWithPhotos';
import ProgramBlocksWithText from '@/components/program/programPageComponents/ProgramBlocksWithText';
import ProgramFirstBlocks from '@/components/program/programPageComponents/ProgramFirstBlocks';
import ProgramHeader from '@/components/program/programPageComponents/ProgramHeader';
import ProgramSchedule from '@/components/program/programPageComponents/ProgramSchedule';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';

function ProgramPreview({ program }: { program: GetArticleByIdResponseDTO | undefined }) {
  const subTitleProgram = program?.contentBlocks?.find(item => item.contentBlockType === 'SUB_TITLE_PROGRAM')?.text;
  const dateProgram = program?.contentBlocks?.find(item => item.contentBlockType === 'DATE_PROGRAM')?.date;
  const descriptionProgram = program?.contentBlocks?.find(item => item.contentBlockType === 'DESCRIPTION_PROGRAM')?.text;

  const blocksWithPhoto = program?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION_WITH_PHOTO');
  const blocksWithText = program?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION_WITH_TEXT');
  const videoURL = program?.contentBlocks?.find(item => item.contentBlockType === 'VIDEO')?.videoUrl;

  const schedulePoster = program?.contentBlocks?.find(item => item.contentBlockType === 'SCHEDULE_POSTER')?.files;
  const scheduleTitle = program?.contentBlocks?.find(item => item.contentBlockType === 'SCHEDULE_TITLE')?.title;
  const scheduleInfo = program?.contentBlocks?.filter(item => item.contentBlockType === 'SCHEDULE_INFO');

  return (
    <>
      <ProgramHeader title={program?.title} classNameParent="!mb-0" />
      <div className="container mx-auto px-4">
        {subTitleProgram && descriptionProgram && <ProgramFirstBlocks title={subTitleProgram} description={descriptionProgram} dateProgram={dateProgram} />}
        <div className="lg:mt-20 mt-10">
          {blocksWithPhoto && blocksWithPhoto?.length > 0 && blocksWithPhoto[0].sectionTitle.length > 0 && <ProgramBlocksWithPhotos contentBlock={blocksWithPhoto} videoURL={videoURL} />}
          {blocksWithText && blocksWithText?.length > 0 && blocksWithText[0].sectionTitle.length > 0 && <ProgramBlocksWithText contentBlock={blocksWithText} />}
          {scheduleInfo && scheduleInfo.length > 0 && <ProgramSchedule schedulePoster={schedulePoster} scheduleTitle={scheduleTitle} scheduleInfo={scheduleInfo} />}
        </div>
      </div>
    </>
  );
}

export default ProgramPreview;
