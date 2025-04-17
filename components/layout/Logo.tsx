import { prefix } from '@/utils/prefix';
import Image from 'next/image';
import Link from 'next/link';

const Logo = ({textColor="text-font-primary"}: {textColor?: string}) => {
  return (
    <>
      <Link href="/" className="flex w-fit gap-x-2">
        <Image src={`${prefix}/logo.svg`} alt="logo" width={64} height={64} />
        <p className={`w-[76px] text-small1 ${textColor}`}>
          Нова Українська Хвиля
        </p>
      </Link>
    </>
  );
};

export default Logo;
