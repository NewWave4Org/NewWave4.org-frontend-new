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
  const isEng = locale === EN_LOCALE;
  const text = isEng ? 'Ukrainian New Wave' : 'Нова Українська Хвиля';
  // In the 80px box the Ukrainian name wraps to 3 lines, which makes the
  // compact (phone) header taller than 64px; give it room for 2 lines there.
  const textWidth =
    compact && !isEng ? 'w-[80px] max-md:w-[120px]' : 'w-[80px]';
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
        <p className={`${textWidth} m-0 text-small1 ${textColor}`}>{text}</p>
      </Link>
    </>
  );
};

export default Logo;
