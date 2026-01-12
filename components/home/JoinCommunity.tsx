import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import { useTranslations } from 'next-intl';

interface IJoinCommunity {
  translatable_text_title: string;
  translatable_text_description: string;
  translatable_text_editorState: any;
  className?: string;
}

const JoinCommunity = ({ joinUs }: { joinUs: IJoinCommunity[] }) => {
  const t = useTranslations();

  return (
    <section className="our-mission lg:my-10 my-5 py-14 bg-skyBlue-300">
      <div className="container mx-auto px-4">
        <h4 className="preheader mb-10 max-w-[1248px] text-center md:text-left mx-auto !text-font-primary">{t('sections_title.join_us')}</h4>
        <div className="flex flex-col items-top gap-6 lg:flex-row lg:justify-between">
          {joinUs?.map((item, i) => {
            const joinDescriptionText = convertDraftToHTML(item?.translatable_text_editorState);
            return (
              <div key={i} className="flex w-full flex-col items-center lg:w-1/3 px-2 lg:px-0">
                <h4 className="mb-4 flex md:justify-items-start items-baseline text-font-accent text-left text-h4 font-ebGaramond gap-4 md:w-full">
                  <span className="text-2xl">{item.translatable_text_title}</span>
                </h4>
                <p className="text-font-primary text-base text-justify" dangerouslySetInnerHTML={{ __html: joinDescriptionText }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;
