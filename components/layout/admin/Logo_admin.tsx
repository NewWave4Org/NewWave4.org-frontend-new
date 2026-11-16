import Image from 'next/image';
import Link from 'next/link';
import { LOGO_SRC } from '@/utils/logo';

type LogoProps = {
  textColor?: string;
};

const LogoAdmin = ({ textColor = 'text-font-primary' }: LogoProps) => {
  const text = 'Ukrainian New Wave';
  return (
    <>
      <Link href="/" className="flex w-fit gap-x-2 items-center">
        <Image src={LOGO_SRC} alt="logo" width={64} height={64} priority />
        <p className={`w-[80px] m-0 text-small1 ${textColor}`}>{text}</p>
      </Link>
    </>
  );
};

export default LogoAdmin;
