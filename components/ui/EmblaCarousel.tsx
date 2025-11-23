'use client';

import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';

const EmblaCarousel = ({ slides, options = {} }: { slides: React.ReactNode[]; options?: EmblaOptionsType }) => {
  const plugins = options.loop ? [Autoplay({ playOnInit: true }), Fade()] : [Fade()];

  const [emblaRef] = useEmblaCarousel(options, plugins);

  return (
    <section className="embla relative">
      <div className="embla__viewport overflow-hidden max-w-[718px] h-[200px] md:h-[524px]" ref={emblaRef}>
        <div className="embla__container flex">
          {slides?.map((slide, index) => (
            <div className="embla__slide !w-[718px] max-w-full" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
