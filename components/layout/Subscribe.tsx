import { prefix } from '@/utils/prefix';
import SubscribeForm from './SubscribeForm';

const Subscribe: React.FC = () => {
  const bgUrl = `${prefix}/bg-subscription.png`;
  return (
    <section
      className="py-[73px] pl-[202px] w-[1440px] mx-auto h-[304px]"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="flex flex-col gap-y-6">
        <h2 className="text-h2 text-font-primary font-baskervville">
          Будьте в курсі наших новин та подій
        </h2>
        <SubscribeForm />
      </div>
    </section>
  );
};

export default Subscribe;
