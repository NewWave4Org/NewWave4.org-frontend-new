import React from "react";
import Image from "next/image";

const Hero = (props: HeroProps) => {
  const data = props.data.uk;

  return (
    <section className="relative min-h-[350px] md:min-h-[554px] flex items-center justify-center text-white px-4">
      <Image
        src={data.img}
        alt={data.title}
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-10">
        <h1 className="font-bold text-2xl md:text-h1 font-baskervville">{data.title}</h1>
      </div>
    </section>
  );
};

export default Hero;