import { prefix } from '@/utils/prefix';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

type DetailedTextInformationProps = {
  quote: {
    description: string;
    editorState: any;
  };
};

const DetailedTextInformation = ({ quote }: DetailedTextInformationProps) => {
  const beforeBg = `${prefix}/background/decor-element-yellow.svg`;
  const afterBg = `${prefix}/background/decor-element-blue.svg`;

  const quoteText = convertDraftToHTML(quote?.editorState);

  return (
    <section className="detailed-text-information">
      <div className="container mx-auto">
        <div className="container__inner max-w-[1036px] mx-auto text-center bg-gray-50 px-8 py-[48px] my-[80px] shadow-custom font-medium text-lg text-font-accent font-helv relative">
          <div className="before-bg absolute bg-cover bg-no-repeat w-[160px] h-[160px] bottom-[-42px] left-6 z-2" style={{ backgroundImage: `url(${beforeBg})` }}></div>
          <div className="after-bg absolute bg-cover bg-no-repeat w-[160px] h-[160px] top-[-42px] right-6 z-2" style={{ backgroundImage: `url(${afterBg})` }}></div>
          <div className="text flex flex-col gap-y-4 max-w-[612px] mx-auto relative z-10">
            <div dangerouslySetInnerHTML={{ __html: quoteText }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedTextInformation;
