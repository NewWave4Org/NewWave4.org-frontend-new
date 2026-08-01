import { useTranslations } from 'next-intl';
import ProgramsSlider from './ProgramsSlider';

const Programs: React.FC = () => {
  const t = useTranslations();
  return (
    <section className="programs lg:py-10 py-5">
      <div className="container mx-auto px-4">
        <h4 className="uppercase !text-font-primary lg:mb-10 mb-6 font-ebGaramond !text-2xl font-bold">
          {t('sections_title.our_programs')}
        </h4>
        <ProgramsSlider />
      </div>
    </section>
  );
};

export default Programs;
