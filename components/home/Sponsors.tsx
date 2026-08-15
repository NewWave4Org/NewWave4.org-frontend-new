import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface IOurPartners {
  id: string;
  contentBlockType: string;
  files: any[];
}

const Sponsors = ({ ourPartners }: { ourPartners: IOurPartners[] }) => {
  const t = useTranslations();
  return (
    <section className="sponsors lg:py-14 py-7">
      <section className="container mx-auto px-4">
        <div className="sponsors__inner">
          <h4 className="lg:mb-0 mb-4 !text-font-primary font-bold text-[34px] lora-family uppercase">
            {t('sections_title.trust_us')}
          </h4>
          <div className="flex items-center flex-wrap">
            {ourPartners?.map((item, index) =>
              item.files.map((img, imgIndex) => (
                <div
                  key={item.id}
                  className="relative p-4 w-full sm:w-1/2 md:w-1/4"
                >
                  <Image
                    key={`${item.id}-${imgIndex}`}
                    className="w-full h-auto object-contain"
                    src={img}
                    alt={`Logo-${index}`}
                    width={200}
                    height={100}
                  />
                </div>
              )),
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Sponsors;
