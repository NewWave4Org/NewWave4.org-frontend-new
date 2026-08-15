import { prefix } from '@/utils/prefix';
import Image from 'next/image';

interface IProgramHeader {
  title: string | undefined;
  classNameParent?: string;
  classNametext?: string;
  pageBanner?: string[];
}

function ProgramHeader({
  title,
  classNameParent = '',
  classNametext = '',
  pageBanner,
}: IProgramHeader) {
  const overlayClasses = pageBanner
    ? 'after:content-[""] after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(to_right,#0F1B40_0%,#0F1B40_0%,rgba(15,27,64,0.8)_50%,rgba(15,27,64,0.25)_80%,transparent_90%)]'
    : '';
  return (
    <section
      className={`${classNameParent} ${overlayClasses} relative min-h-[177px] md:min-h-[177px] flex items-center text-white page-banner`}
    >
      <Image
        src={`${pageBanner && pageBanner?.length > 0 ? pageBanner : `${prefix}/programs/program.png`}`}
        alt={title || ''}
        fill
        className="object-cover"
        priority
      />
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="font-bold text-[45px] lg:text-h1 lora-family uppercase page-banner__title relative">
          {title}
        </h1>
      </div>
    </section>
  );
}

export default ProgramHeader;
