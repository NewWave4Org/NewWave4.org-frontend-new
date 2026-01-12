'use client';
import Link from 'next/link';
import MessageIcon from '../icons/symbolic/MessageIcon';
import LocationIcon from '../icons/symbolic/LocationIcon';
import ContactForm from './ContactForm';
import SocialButtons from '../socialButtons/SocialButtons';
import { useTranslations } from 'next-intl';

const Contacts: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="container px-4 mx-auto">
      <div className="contacts-section">
        <div className="flex flex-col justify-between max-w-[399px]">
          <div className="flex flex-col gap-y-4 lg:mb-0 mb-4">
            <h3 className="text-h3 text-font-primary font-ebGaramond">
              {t('form_contact_us.title')}
            </h3>
            <p className="text-body text-font-primary">
               {t('form_contact_us.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-y-4 lg:mb-0 mb-4">
            <div className="inline-flex gap-x-2">
              <MessageIcon color="#006ABB" />
              <Link href={'mailto:newwaveorg4@yahoo.com'} className="text-body text-status-link">
                newwaveorg4@yahoo.com
              </Link>
            </div>
            <div className="inline-flex gap-x-2">
              <LocationIcon color="#5A5A5A" />
              <p className="text-body text-grey-700"> {t('form_contact_us.location')}</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 lg:mb-0 mb-4">
            <p className="text-small text-grey-700">{t('form_contact_us.our_social_media')}</p>
            <div className="flex gap-x-2">
              <SocialButtons />
            </div>
          </div>
        </div>
        <div className="max-w-[544px] flex-1">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contacts;
