import Image from 'next/image';

interface CardProps {
  imageSrc: string;
  title: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, title, text }) => {
  return (
    <div className="bg-white shadow-custom rounded-lg w-[400px] overflow-hidden">
      <div className="relative w-[400px] h-[208px]">
        <Image src={imageSrc} alt={title} fill objectFit="cover" />
      </div>
      <div className="pt-2 pb-4 px-4 flex flex-col gap-y-2">
        <h2 className="text-font-primary text-body font-medium">{title}</h2>
        <p className="text-grey-700 text-info truncate">{text}</p>
      </div>
    </div>
  );
};

export default Card;
