import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

interface IWhoWeAre {
  homeTitle: { title: string };
  homeDescription: {
    editorState: any;
    description: string;
  };
}

const WhoWeAre: React.FC<IWhoWeAre> = ({ homeTitle, homeDescription }) => {
  const homeDescriptionText = convertDraftToHTML(homeDescription?.editorState);
  return (
    <div className="whoWeAre">
      <section className="flex lg:flex-row flex-col">
        <div className=" bg-background-secondary flex-1 flex lg:justify-end justify-center">
          <div className="lg:max-w-[708px] max-w-full md:py-12 md:px-24 py-6 px-12">
            <div className="container">
              <h2 className="text-h2 text-font-primary font-ebGaramond">{homeTitle?.title}</h2>
            </div>
          </div>
        </div>
        <div className=" bg-font-white items-center flex-1 flex justify-start">
          <div className="lg:max-w-[732px] max-w-full md:px-24 md:py-12 py-6 px-12">
            <div className="container">
              <div className="text-body text-font-primary" dangerouslySetInnerHTML={{ __html: homeDescriptionText }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;
