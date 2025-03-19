'use client';

import React, { useEffect } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ArrowLeft4Icon from '../icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '../icons/navigation/ArrowRight4Icon';

type PropType = {
  slides: React.ReactNode[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;

  const plugins = options?.loop ? [
    // Autoplay({ playOnInit: true, delay: 4000 }),
  ] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  const {
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla relative">
      <div className="embla__viewport overflow-hidden max-w-[1036px]" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide, index) => (
            <div className="embla__slide flex-[0_0_calc(100%/5)] min-w-0 max-w-[180px] mr-8" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="embla__controls w-full flex justify-between">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} className='left-[-5rem] top-[35%] absolute bg-primary-400 rounded-full w-[60px] h-[60px] p-3 z-10'>
            <ArrowLeft4Icon size="32" color="#fafafa" />
          </PrevButton>
          <NextButton onClick={onNextButtonClick} className='right-[-5rem] top-[35%] absolute bg-primary-400 rounded-full w-[60px] h-[60px] p-3 z-10'>
            <ArrowRight4Icon size="32" color="#fafafa" />
          </NextButton>
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
