import Image from 'next/image';
import List from '../shared/List';

const HistoryCard = ({ data } : { data: {title: string, card: {imageSrc : string, title: string, items: string[]}}}) => {
  return (
    <section className="history-card py-14 my-20">
      <div className="history-card__inner max-w-[1247px] mx-auto">
        <h4 className="preheader mb-10 text-center md:text-left mx-auto">{data.title}</h4>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-full md:w-3/5 max-w-[718px] flex justify-center sm:justify-start">
            <Image 
              src={data.card.imageSrc} 
              alt={data.card.title} 
              width={718} 
              height={524}
              className="rounded-xl object-cover w-full h-full"
            />
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