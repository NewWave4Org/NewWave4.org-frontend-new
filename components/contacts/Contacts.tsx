'use client';
import Link from 'next/link';
import YoutubeIcon from '../icons/social/YoutubeIcon';
import IconButton from '../icons/IconButton';
import FacebookIcon from '../icons/social/FacebookIcon';
import InstagramIcon from '../icons/social/InstagramIcon';
import MessageIcon from '../icons/symbolic/MessageIcon';
import LocationIcon from '../icons/symbolic/LocationIcon';
import ContactForm from './ContactForm';

const Contacts: React.FC = () => {
  return (
    <div className="contacts-section">
      <div className="flex flex-col justify-between max-w-[399px]">
        <div className="flex flex-col gap-y-4">
          <h3 className="text-h3 text-font-primary font-ebGaramond">
            Зв’яжіться з нами
          </h3>
          <p className="text-body text-font-primary">
            Маєте запитання? Заповніть форму або зв’яжіться зручним для вас
            способом
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="inline-flex gap-x-2">
            <MessageIcon color="#006ABB" />
            <Link
              href={'mailto:newwaveorg4@yahoo.com'}
              className="text-body text-status-link"
            >
              newwaveorg4@yahoo.com
            </Link>
          </div>
          <div className="inline-flex gap-x-2">
            <LocationIcon color="#5A5A5A" />
            <p className="text-body text-grey-700">
              Бруклін-Статен Айленд, Нью Йорк
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <p className="text-small text-grey-700">Наші соц. мережі</p>
          <div className="flex gap-x-2">
            <IconButton
              onClick={() =>
                window.open(
                  'https://www.instagram.com/newwavebrooklynschool?igsh=MXd3cXdwN3JzcGtuMQ==',
                )
              }
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                window.open(
                  'https://www.facebook.com/profile.php?id=100068772616023',
                )
              }
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                window.open(
                  'https://youtube.com/@ukrainiannewwave627?si=T6tZNSsKsR0JKlPZ',
                )
              }
            >
              <YoutubeIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div>
        <ContactForm />
      </div>
    </div>
  );
};

export default Contacts;
