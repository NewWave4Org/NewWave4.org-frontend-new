import Image from 'next/image';
import { prefix } from '@/utils/prefix';

const Sponsors: React.FC = () => {
  return (
    <section className="sponsors">
      <h4 className="preheader">Нам довіряють</h4>
      <div className="sponsors-logos">
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
    </section>
  );
};

export default Sponsors;
