import Image from 'next/image';
import List from '../shared/List';
import EmblaCarousel from '@/components/ui/EmblaCarousel';

const HistoryCard = ({ data } : { data: {title: string, card: {carousel : string[], title: string, items: string[]}}}) => {

    const slides = data.card.carousel.map((url, i) => {

    // todo: remove condition when images will be added.

    return (
      <Image 
        key={i}
        src={i == 0 ? url : `https://picsum.photos/600/350?v=${i}`} 
        alt={data.card.title} 
        width={718} 
        height={524}
        className="rounded-xl object-cover w-full h-[200px] embla__slide__img md:h-[524px] md:w-[718px]"
      />
    );
  });

  return (
    <section className="history-card py-14 my-20">
      <div className="history-card__inner container px-4 mx-auto">
        <h4 className="preheader mb-10 text-center md:text-left mx-auto !text-font-primary">{data.title}</h4>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-full md:w-3/5 max-w-[718px] overflow-hidden">
            <EmblaCarousel slides={slides} options={{ loop: true }} />
          </div>
          <div className="w-full md:w-2/5 flex flex-col justify-center mt-4 sm:mt-0">
            <h4 className="text-lg sm:text-xl font-ebGaramond text-font-accent mb-6 font-semibold text-center sm:text-left leading-[140%]">{data.card.title}</h4>
            <List items={data.card.items} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryCard;