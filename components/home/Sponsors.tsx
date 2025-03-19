import Image from 'next/image';
import { prefix } from '@/utils/prefix';

const Sponsors: React.FC = () => {
  return (
    <section className="sponsors">
      <section className="container mx-auto px-4">
        <div className="sponsors__inner">
          <h4 className="preheader lg:mb-0 mb-4">Нам довіряють</h4>
          <div className="sponsors-logos lg:flex-row md:flex-col sm:flex-col flex-col gap-y-6 lg:gap-y-0">
            <Image
              src={`${prefix}/sponsors/Logo_Credit_Union.svg`}
              alt="Logo Credit-Union"
              width={250}
              height={42}
            />
            <Image
              src={`${prefix}/sponsors/self-reliance-new-york.svg`}
              alt="Logo Self-Reliance-New-York"
              width={240}
              height={62}
            />
            <Image
              src={`${prefix}/sponsors/Logo_Credit_Union.svg`}
              alt="Logo Credit-Union"
              width={250}
              height={42}
            />
          </div>
        </div>
      </section>
    </section>
  );
};

export default Sponsors;