import { EN_LOCALE, Link } from '@/i18n';
import { prefix } from '@/utils/prefix';
import Image from 'next/image';


type LogoProps = {
  textColor?: string;
  locale?: string;
};

const Logo = ({
  textColor = 'text-font-primary',
  locale = 'en',
}: LogoProps) => {

  const text = locale === EN_LOCALE ? 'Ukrainian New Wave' : 'Нова Українська Хвиля';
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
        <p className={`w-[80px] m-0 text-small1 ${textColor}`}>{text}</p>
      </Link>
    </>
  );
};

export default Logo;
