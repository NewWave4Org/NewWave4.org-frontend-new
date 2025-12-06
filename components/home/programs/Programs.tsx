import ProgramsSlider from './ProgramsSlider';

const Programs: React.FC = () => {
  return (
    <section className="programs lg:py-10 py-5">
      <div className="container mx-auto px-4">
        <h4 className="preheader !text-font-primary lg:mb-0 mb-6">Наші програми</h4>
        <ProgramsSlider />
      </div>
    </section>
  );
};

export default Programs;
