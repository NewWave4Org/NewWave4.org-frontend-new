import { EN_LOCALE, Link } from '@/i18n';
import { prefix } from '@/utils/prefix';
import Image from 'next/image';

type LogoProps = {
  textColor?: string;
  locale?: string;
  compact?: boolean;
};

const Logo = ({
  textColor = 'text-font-primary',
  locale = 'en',
  compact = false,
}: LogoProps) => {
  const text =
    locale === EN_LOCALE ? 'Ukrainian New Wave' : 'Нова Українська Хвиля';
  return (
    <>
      <Link href="/" className="flex w-fit gap-x-2 items-center">
        <Image
          src={`${prefix}/logo.png`}
          alt="logo"
          width={64}
          height={64}
          priority
          className={compact ? 'max-md:h-11 max-md:w-11' : undefined}
        />
        <p className={`w-[80px] m-0 text-small1 ${textColor}`}>{text}</p>
      </Link>
    </>
  );
};

export default Logo;
