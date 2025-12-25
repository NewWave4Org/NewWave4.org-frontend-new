import { convertDraftToHTML } from '@/components/TextEditor/utils/convertDraftToHTML';
import { convertYoutubeUrlToEmbed } from '@/utils/videoUtils';
import Image from 'next/image';

interface IProgramContentProps {
  contentBlock: any[] | undefined;
}

function ProgramBlocksWithPhotos({ contentBlock }: IProgramContentProps) {
  return (
    <div className="container mx-auto px-4">
      {contentBlock?.map((content, index) => {
        const oddBlock = index % 2 !== 0;
        const htmlText = convertDraftToHTML(content?.editorState);
        return (
          <div key={index} className={`flex lg:flex-row flex-col lg:mb-20 mb-10 gap-x-3 ${oddBlock ? 'odd' : ''}`}>
            <div className={`flex-1 lg:pr-[64px] lg:pb-0 pr-0 pb-5 ${oddBlock ? 'lg:order-2 order-1 !pr-0 lg:pl-10 pl-0' : ''}`}>
              <div className="text-h3 font-ebGaramond mb-5 max-w-[530px] text-font-primary ">{content?.sectionTitle}</div>
              <div className="text-body text-font-primary" dangerouslySetInnerHTML={{ __html: htmlText }} />
            </div>
            {content?.files?.length > 0 && (
              <div className={`lg:w-[612px] lg:max-w-[612px] w-full ${oddBlock ? 'lg:order-1 order-2' : ''}`}>
                <div className="relative h-[360px] w-full">
                  {content.files.map((file: string, idx: number) => (
                    <Image key={idx} src={file} alt={content.sectionTitle} fill className="object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProgramBlocksWithPhotos;
