import { prefix } from '@/utils/prefix';
import SubscribeForm from './SubscribeForm';

const Subscribe: React.FC = () => {
  const bgUrl = `${prefix}/bg-subscription.png`;
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
              Будьте в курсі наших новин та подій
            </h2>
            <SubscribeForm />
          </div>
        </div>
      </section>
  );
};

export default Subscribe;
