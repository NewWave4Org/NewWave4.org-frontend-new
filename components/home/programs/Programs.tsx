import { useTranslations } from 'next-intl';
import ProgramsSlider from './ProgramsSlider';

const Programs: React.FC = () => {
  const t = useTranslations();
  return (
    <section className="programs lg:py-10 py-5">
      <div className="container mx-auto px-4">
        <h4 className="preheader !text-font-primary lg:mb-10 mb-6">{t('sections_title.our_programs')}</h4>
        <ProgramsSlider />
      </div>
    </section>
  );
};

export default Programs;
