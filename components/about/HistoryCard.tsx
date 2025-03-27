import Image from 'next/image';
// import { CheckCircle } from 'lucide-react';

const HistoryCard = ({ data } : { data: {imageSrc : string, title: string, items: string[]}}) => {
  return (
    <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-2xl p-4 max-w-2xl">
      <div className="w-full sm:w-1/3 flex justify-center sm:justify-start">
        <Image 
          src={data.imageSrc} 
          alt={data.title} 
          width={718} 
          height={524}
          className="rounded-xl object-cover w-32 h-32 sm:w-full sm:h-full"
        />
      </div>
      <div className="w-full sm:w-2/3 sm:pl-4 flex flex-col justify-center mt-4 sm:mt-0">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center sm:text-left">{data.title}</h3>
        <ul className="space-y-1">
          {data.items.map((item: string, index: number) => (
            <li key={index} className="flex items-center text-gray-700 justify-center sm:justify-start">
              {/* <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> */}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryCard;