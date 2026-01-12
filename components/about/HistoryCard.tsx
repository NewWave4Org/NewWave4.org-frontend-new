import EmblaCarousel from '@/components/ui/EmblaCarousel';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import { useTranslations } from 'next-intl';

interface IHistoryCard {
  ourHistoryTitle: string;
  ourHistoryDescription: {
    translatable_text_text: string;
    translatable_text_editorState: any;
  };
  ourHistoryPhotos: { files: any[] };
}

const HistoryCard = ({ ourHistoryTitle, ourHistoryDescription, ourHistoryPhotos }: IHistoryCard) => {
  const t = useTranslations();

  const ourHistoryDescriptionText = convertDraftToHTML(ourHistoryDescription?.translatable_text_editorState);

  return (
    <section className="history-card py-14 my-20">
      <div className="history-card__inner container px-4 mx-auto">
        <h4 className="preheader mb-10 text-center md:text-left mx-auto !text-font-primary">{t('sections_title.our_story')}</h4>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:max-w-[718px] overflow-hidden">
            <EmblaCarousel slides={ourHistoryPhotos} />
          </div>
          <div className="w-full lg:w-2/5 flex flex-col justify-center mt-4 sm:mt-0">
            <h4 className="text-lg sm:text-xl font-ebGaramond text-font-accent mb-6 font-semibold text-center sm:text-left leading-[140%]">{ourHistoryTitle}</h4>
            <div dangerouslySetInnerHTML={{ __html: ourHistoryDescriptionText }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryCard;
