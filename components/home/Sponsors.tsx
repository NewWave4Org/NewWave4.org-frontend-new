import Image from 'next/image';

interface IOurPartners {
  ourPartners: {
    files: any[];
  };
}

const Sponsors: React.FC<IOurPartners> = ({ ourPartners }) => {
  return (
    <section className="sponsors">
      <section className="container mx-auto px-4">
        <div className="sponsors__inner">
          <h4 className="preheader lg:mb-0 mb-4 !text-font-primary">Нам довіряють</h4>
          <div className="sponsors-logos lg:flex-row md:flex-col sm:flex-col flex-col gap-y-6 lg:gap-y-0">
            {ourPartners?.files.map((item, index) => (
              <Image key={index} src={item.src} alt={`Logo-${index}`} width={250} height={42} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Sponsors;
