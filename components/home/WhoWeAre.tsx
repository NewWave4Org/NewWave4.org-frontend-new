import Image from 'next/image';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

interface IWhoWeAre {
  homeTitle: { title: string };
  homeDescription: {
    editorState: any;
    description: string;
  };
  className?: string;
}

const WhoWeAre: React.FC<IWhoWeAre> = ({ homeTitle, homeDescription, className }) => {
  const homeDescriptionText = convertDraftToHTML(homeDescription?.editorState);
  return (
    <div className={`whoWeAre ${className} lg:pt-0 pt-5`}>
      <div className="max-w-[1440px] lg:px-0 px-4 mx-auto lg:h-full overflow-hidden">
        <div className="flex xl:flex-row flex-col items-center lg:h-full">
          <div className="lg:max-w-[820px] xl:ml-[96px] xl:mr-[85px] mx-4 lg:py-5 lg:mb-0 mb-5">
            <h1 className="lg:text-h1 text-h3 text-font-primary font-ebGaramond mb-3">{homeTitle?.title}</h1>
            <div className="text-body text-font-primary" dangerouslySetInnerHTML={{ __html: homeDescriptionText }} />
          </div>
          <div className="xl:flex-1 lg:max-w-[820px] relative min-h-[415px] lg:h-full h-[415px] w-full rounded-xl">
            <Image src="/home/flags.png" fill alt={homeTitle?.title ?? 'Зображення прапорів'} className="xl:object-cover object-contain object-top rounded-xl top-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
