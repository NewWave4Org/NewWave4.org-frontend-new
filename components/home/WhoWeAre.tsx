import Image from 'next/image';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import { useLocale } from 'next-intl';

interface IWhoWeAre {
  homeTitle: string;
  homeDescription: {
    translatable_text_editorState: any;
    translatable_text_description: string;
  };
  homePhoto: {
    contentBlockType: string,
    files: string[];
    id: string
  };
  className?: string;
}

const WhoWeAre: React.FC<IWhoWeAre> = ({ homeTitle, homeDescription, homePhoto, className }) => {
  const locale = useLocale();

  const homeDescriptionText = convertDraftToHTML(homeDescription?.translatable_text_editorState, locale);
  const homePhotoFile = homePhoto?.files[0];

  console.log('asd', homeTitle);

  return (
    <div className={`whoWeAre ${className} lg:pt-0 pt-5`}>
      <div className="max-w-[1440px] lg:px-0 px-4 mx-auto lg:h-full overflow-hidden">
        <div className="flex lg:flex-row flex-col items-center lg:h-full">
          <div className="lg:max-w-[820px] xl:flex-1 2xl:ml-[96px] xl:ml-5 xl:mr-[85px] mx-4 lg:py-5 lg:mb-0 mb-5">
            <h1 className="lg:text-h1 text-h3 text-font-primary font-ebGaramond mb-3">{homeTitle}</h1>
            <div className="text-body text-font-primary" dangerouslySetInnerHTML={{ __html: homeDescriptionText }} />
          </div>
          <div className=" lg:max-w-[435px] lg:min-w-[360px] relative min-h-[415px] lg:h-full h-[415px] w-full rounded-xl mr-4">
            {homePhotoFile && ( 
              <Image src={homePhotoFile} fill alt={homeTitle?.translatable_text_title ?? 'photo'} 
              className="lg:object-cover object-contain object-top rounded-xl top-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
