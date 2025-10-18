import { IArticleBody } from '@/utils/article-content/type/interfaces';
import ProgramBlockItem from './ProgramBlockItem';

function ProgramBlocks({ dopPrograms }: { dopPrograms: IArticleBody[] }) {
  return (
    <div className="program-block-dop">
      <div className="container mx-auto px-4">
        <h4 className="preheader !text-font-primary lg:mb-10 mb-6">Інші програми</h4>

        <div className="flex flex-col lg:flex-row -ml-3 -mr-3">
          {dopPrograms.map(item => {
            const description = item?.contentBlocks?.find(item => item.contentBlockType === 'DESCRIPTION_PROGRAM').text;
            const imageSrc = item?.contentBlocks?.find(item => item.contentBlockType === 'SCHEDULE_POSTER')?.files;

            return <ProgramBlockItem key={item.id} title={item.title} description={description} id={item.id} imageSrc={imageSrc} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgramBlocks;
