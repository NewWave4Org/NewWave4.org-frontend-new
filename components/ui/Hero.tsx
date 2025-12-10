import Image from 'next/image';

const Hero = ({ title, pageBanner }: { title: string; pageBanner?: string }) => {
  const overlayClasses = pageBanner ? 'after:content-[""] after:absolute after:inset-0 after:z-[1] after:bg-[rgba(0,0,0,0.2)]' : '';

  return (
    <section className={`relative min-h-[420px] md:min-h-[420px] flex items-end text-white ${overlayClasses}`}>
      <Image src={`${pageBanner ? pageBanner : `/hero/about.svg`}`} alt={title || ''} fill className="object-cover" priority />
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="font-bold text-3xl lg:text-h1 font-ebGaramond pb-8">{title}</h1>
      </div>
    </section>
  );
};

export default Hero;
