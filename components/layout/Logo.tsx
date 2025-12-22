import { prefix } from '@/utils/prefix';
import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  textColor?: string;
  language?: 'ua' | 'en';
};

const Logo = ({
  textColor = 'text-font-primary',
  language = 'ua',
}: LogoProps) => {
  const text =
    language === 'en' ? 'Ukrainian New Wave' : 'Нова Українська Хвиля';
  return (
    <>
      <Link href="/" className="flex w-fit gap-x-2 items-center">
        <Image
          src={`${prefix}/logo.svg`}
          alt="logo"
          width={64}
          height={64}
          priority
        />
        <p className={`w-[50px] m-0 text-small1 ${textColor}`}>{text}</p>
      </Link>
    </>
  );
};

export default Logo;
