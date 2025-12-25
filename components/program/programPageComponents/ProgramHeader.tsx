import { prefix } from '@/utils/prefix';
import Image from 'next/image';

interface IProgramHeader {
  title: string | undefined;
  classNameParent?: string;
  classNametext?: string;
  pageBanner?: string[];
}

function ProgramHeader({ title, classNameParent = '', classNametext = '', pageBanner }: IProgramHeader) {
  console.log('pageBanner', pageBanner);
  const overlayClasses = pageBanner ? 'after:content-[""] after:absolute after:inset-0 after:z-[1] after:bg-[rgba(0,0,0,0.2)]' : '';
  return (
    <section className={`${classNameParent} relative ${overlayClasses} min-h-[420px] md:min-h-[420px] flex items-end justify-start text-white`}>
      <Image src={`${pageBanner && pageBanner?.length > 0 ? pageBanner : `${prefix}/hero/about.svg`}`} alt={title || ''} fill className="object-cover" priority />
      <div className="container mx-auto px-4">
        <div className={`${classNametext} relative z-10 pb-16 w-1/2`}>
          <h1 className="font-bold text-3xl lg:text-h1 font-ebGaramond">{title}</h1>
        </div>
      </div>
    </section>
  );
}

export default ProgramHeader;
