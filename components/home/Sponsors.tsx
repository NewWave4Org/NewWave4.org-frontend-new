import Image from 'next/image';

interface IOurPartners {
  id: string;
  contentBlockType: string;
  files: any[];
}

const Sponsors = ({ ourPartners }: { ourPartners: IOurPartners[] }) => {
  return (
    <section className="sponsors lg:py-14 py-7">
      <section className="container mx-auto px-4">
        <div className="sponsors__inner">
          <h4 className="preheader lg:mb-0 mb-4 !text-font-primary">Нам довіряють</h4>
          <div className="sponsors-logos lg:flex-row md:flex-col sm:flex-col flex-col gap-y-6 lg:gap-y-0 flex-wrap">
            {ourPartners?.map((item, index) => item.files.map((img, imgIndex) => <Image key={`${item.id}-${imgIndex}`} className="m-4" src={img} alt={`Logo-${index}`} width={250} height={42} />))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Sponsors;
