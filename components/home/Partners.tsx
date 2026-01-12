import { useTranslations } from 'next-intl';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import PartnerForm from './PartnerForm';

interface IOurPartners {
  translatable_text_title: string;
  translatable_text_description: string;
  translatable_text_editorState: any;
}

interface PartnersProps {
  ourPartnersContent: IOurPartners;
  className?: string;
}

const Partners: React.FC<PartnersProps> = ({ ourPartnersContent, className }) => {
  const t = useTranslations();

  const partnerDescriptionText = convertDraftToHTML(ourPartnersContent?.translatable_text_editorState);

  return (
    <section className={`${className} sponsors py-14`}>
      <div className="container mx-auto px-4">
        <div className="sponsors__inner">
          <h4 className="preheader !text-font-primary">{t('sections_title.become_partner')}</h4>
          <div className="flex gap-x-[108px] lg:flex-row flex-col">
            <div className="partners-text lg:max-w-[524px] lg:w-[525px] w-full max-w-full">
              <h4 className="text-h4 text-font-accent font-ebGaramond">{ourPartnersContent?.translatable_text_title}</h4>
              <p className="text-body text-font-primary" dangerouslySetInnerHTML={{ __html: partnerDescriptionText }} />
            </div>
            <div className="partners-form lg:max-w-[480px]">
              <p className="text-body text-grey-700 font-medium">{t('forms_label.title')}</p>
              <PartnerForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
