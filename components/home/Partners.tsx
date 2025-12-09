import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import PartnerForm from './PartnerForm';

interface IOurPartners {
  title: string;
  description: string;
  editorState: any;
}

interface PartnersProps {
  ourPartnersContent: IOurPartners;
  className?: string;
}

const Partners: React.FC<PartnersProps> = ({ ourPartnersContent, className }) => {
  const partnerDescriptionText = convertDraftToHTML(ourPartnersContent?.editorState);
  return (
    <section className={`${className} sponsors py-14`}>
      <div className="container mx-auto px-4">
        <div className="sponsors__inner">
          <h4 className="preheader !text-font-primary">Стати партнером</h4>
          <div className="flex gap-x-[108px] lg:flex-row flex-col">
            <div className="partners-text lg:max-w-[524px] max-w-full">
              <h4 className="text-h4 text-font-accent font-ebGaramond">{ourPartnersContent?.title}</h4>
              <p className="text-body text-font-primary" dangerouslySetInnerHTML={{ __html: partnerDescriptionText }} />
            </div>
            <div className="partners-form">
              <p className="text-body text-grey-700 font-medium">Залиште свій email та ми з Вами зв’яжемось</p>
              <PartnerForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
