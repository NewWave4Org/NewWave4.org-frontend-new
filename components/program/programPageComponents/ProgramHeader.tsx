import { prefix } from '@/utils/prefix';
import Image from 'next/image';

interface IProgramHeader {
  title: string | undefined;
  classNameParent?: string;
  classNametext?: string;
}

function ProgramHeader({ title, classNameParent = '', classNametext = '' }: IProgramHeader) {
  return (
    <section className={`${classNameParent} relative min-h-[350px] md:min-h-[554px] flex items-end justify-start text-white`}>
      <Image src={`${prefix}/hero/about.svg`} alt={title || ''} fill className="object-cover" priority />
      <div className="container mx-auto px-4">
        <div className={`${classNametext} relative z-10 pb-16 w-1/2`}>
          <h1 className="font-bold text-3xl lg:text-h1 font-ebGaramond">{title}</h1>
        </div>
      </div>
    </section>
  );
}

export default ProgramHeader;
