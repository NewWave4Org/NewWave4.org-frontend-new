import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  imageSrc: string;
  title: string;
  text: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, title, text, link }) => {
  return (
    <Link
      href={link}
      className="bg-white shadow-custom rounded-lg w-[400px] overflow-hidden flex flex-col h-full hover:shadow-lg duration-500 "
    >
      <div className="relative w-[400px] h-[208px]">
        <Image src={imageSrc} alt={title} fill style={{ objectFit: 'cover' }} />
      </div>
      <div className="pt-2 pb-4 px-4 flex flex-col gap-y-2 flex-1">
        <h2 className="text-font-primary text-body font-medium">{title}</h2>
        <p className="text-grey-700 text-info truncate">{text}</p>
      </div>
    </Link>
  );
};

export default Card;
