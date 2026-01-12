import { prefix } from '@/utils/prefix';
import SubscribeForm from './SubscribeForm';
import { useTranslations } from 'next-intl';

const Subscribe: React.FC = () => {
  const bgUrl = `${prefix}/bg-subscription.png`;
  const t = useTranslations();
  return (
    
      <section
        className="py-[72px]"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
        }}
      >
        <div className='container mx-auto px-4'>
          <div className="flex flex-col gap-y-6 lg:pl-[105px]">
            <h2 className="text-h2 text-font-primary font-ebGaramond">
              {t('sections_title.subscription')}
            </h2>
            <SubscribeForm />
          </div>
        </div>
      </section>
  );
};

export default Subscribe;
