'use client';

import ProgramBlocksWithPhotos from '@/components/program/programPageComponents/ProgramBlocksWithPhotos';
import ProgramBlocksWithText from '@/components/program/programPageComponents/ProgramBlocksWithText';
import ProgramFirstBlocks from '@/components/program/programPageComponents/ProgramFirstBlocks';
import ProgramHeader from '@/components/program/programPageComponents/ProgramHeader';
import ProgramSchedule from '@/components/program/programPageComponents/ProgramSchedule';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';

function ProgramPreview({ program }: { program: GetArticleByIdResponseDTO | undefined }) {
  const titleProgram = program?.title;
  const pageBanner = program?.contentBlocks?.find(item => item.contentBlockType === 'PAGE_BANNER')?.files;
  const dateProgram = program?.contentBlocks?.find(item => item.contentBlockType === 'DATE_PROGRAM')?.date;
  const descriptionProgram = program?.contentBlocks?.find(item => item.contentBlockType === 'DESCRIPTION_PROGRAM')?.editorState;

  const blocksWithPhoto = program?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION_WITH_PHOTO');
  const filteredBlocksWithPhoto = blocksWithPhoto?.filter(item => {
    return item.sectionTitle !== '' || item.text !== '' || item.files.length > 0;
  });

  const blocksWithText = program?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION_WITH_TEXT');
  const filteredBlocksWithText = blocksWithText?.filter(item => {
    return item.sectionTitle !== '' || item.text1 !== '' || item.text2 !== '';
  });

  const videoURL = program?.contentBlocks?.find(item => item.contentBlockType === 'VIDEO')?.videoUrl;

  const schedulePoster = program?.contentBlocks?.find(item => item.contentBlockType === 'SCHEDULE_POSTER')?.files;
  const scheduleTitle = program?.contentBlocks?.find(item => item.contentBlockType === 'SCHEDULE_TITLE')?.title;

  const scheduleInfo = program?.contentBlocks?.filter(item => item.contentBlockType === 'SCHEDULE_INFO');
  const filteredScheduleInfo = scheduleInfo?.filter(item => {
    return item.location !== '' || item.title !== '';
  });

  return (
    <>
      <ProgramHeader title="Програма" pageBanner={pageBanner} classNameParent="!mb-0" />
      <div className="">
        {(titleProgram || descriptionProgram) && <ProgramFirstBlocks title={titleProgram} description={descriptionProgram} dateProgram={dateProgram} />}
        <div className="lg:mt-20 mt-10">
          {((filteredBlocksWithPhoto && filteredBlocksWithPhoto.length > 0) || (videoURL && videoURL.length > 0)) && <ProgramBlocksWithPhotos contentBlock={filteredBlocksWithPhoto} videoURL={videoURL} />}
          {filteredBlocksWithText && filteredBlocksWithText?.length > 0 && <ProgramBlocksWithText contentBlock={filteredBlocksWithText} />}
          {filteredScheduleInfo && filteredScheduleInfo.length > 0 && <ProgramSchedule schedulePoster={schedulePoster} scheduleTitle={scheduleTitle} scheduleInfo={filteredScheduleInfo} />}
        </div>
      </div>
    </>
  );
}

export default ProgramPreview;
