import ProgramsSlider from './ProgramsSlider';

const Programs: React.FC = () => {
  return (
    <section className="container mx-auto px-4">
      <div className="sponsors__inner">
        <h4 className="preheader !text-font-primary">Наші програми</h4>
        <ProgramsSlider />
      </div>
    </section>
  );
};

export default Programs;
