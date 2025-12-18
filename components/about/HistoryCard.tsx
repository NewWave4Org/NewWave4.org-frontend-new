import EmblaCarousel from '@/components/ui/EmblaCarousel';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

interface IHistoryCard {
  ourHistoryTitle: string;
  ourHistoryDescription: {
    text: string;
    editorState: any;
  };
  ourHistoryPhotos: { files: any[] };
}

const HistoryCard = ({ ourHistoryTitle, ourHistoryDescription, ourHistoryPhotos }: IHistoryCard) => {
  const ourHistoryDescriptionText = convertDraftToHTML(ourHistoryDescription?.editorState);

  return (
    <section className="history-card py-14 my-20">
      <div className="history-card__inner container px-4 mx-auto">
        <h4 className="preheader mb-10 text-center md:text-left mx-auto !text-font-primary">Наша історія</h4>
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
