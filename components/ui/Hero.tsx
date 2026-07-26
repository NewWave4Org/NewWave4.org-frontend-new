import Image from 'next/image';

const Hero = ({ title, pageBanner }: { title: string; pageBanner?: string }) => {
  return (
    <section className="relative min-h-[177px] md:min-h-[177px] flex items-end text-white">
      <Image src={`${pageBanner ? pageBanner : `/hero/about.svg`}`} alt={title || ''} fill className="object-cover" priority />
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="font-bold text-3xl lg:text-h1 font-ebGaramond uppercase page-banner__title relative">{title}</h1>
      </div>
    </section>
  );
};

export default Hero;
