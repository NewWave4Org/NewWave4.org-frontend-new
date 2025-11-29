import { convertDraftToHTML } from '@/components/TextEditor/utils/convertDraftToHTML';

function ProgramBlocksWithText({ contentBlock }: { contentBlock: any[] }) {
  return (
    <>
      <div className="content">
        <div className="container mx-auto px-4">
          {contentBlock?.map((content, index) => {
            const htmlText1 = convertDraftToHTML(content?.editorState1);
            const htmlText2 = convertDraftToHTML(content?.editorState2);
            return (
              <div key={index} className="pt-3 lg:mb-20 mb-10">
                <div className="text-h3 font-ebGaramond mb-5 max-w-[530px] text-font-primary ">{content?.sectionTitle}</div>
                <div className="flex gap-3">
                  <div className="text-body w-1/2 text-font-primary" dangerouslySetInnerHTML={{ __html: htmlText1 }} />
                  <div className="text-body w-1/2 text-font-primary" dangerouslySetInnerHTML={{ __html: htmlText2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProgramBlocksWithText;
