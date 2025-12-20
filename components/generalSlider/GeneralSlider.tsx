'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import ArrowLeft4Icon from '../icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '../icons/navigation/ArrowRight4Icon';

export interface Slide {
  title: string;
  files: string[];
  description?: string;
  editorState?: any[];
  link: string;
}

interface GeneralSliderProps {
  slides: Slide[];
  autoplayDelay?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  slideHover?: boolean;
  hasLink?: boolean;
  className?: string;
}

const GeneralSlider: React.FC<GeneralSliderProps> = ({ slides, autoplayDelay = 4000, loop = true, showArrows = true, showDots = true, slideHover = true, className = '' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: loop, align: 'center' }, [Autoplay({ playOnInit: true, delay: autoplayDelay })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const initSlider = slides.length > 1;

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const slideWidthClass =
    slides.length === 2
      ? 'w-full flex-1 flex-shrink-0' // 2 full width
      : initSlider
      ? 'w-[540px]' // 3+ slide
      : 'w-full flex-1 flex-shrink-0';

  const slideSize = slides.length === 2 ? '100%' : '540px';

  return (
    <div className={`${className} relative embla h-[370px] group/arrows`}>
      <div className="overflow-hidden h-full" ref={initSlider ? emblaRef : null}>
        <div className={`${initSlider ? 'flex' : 'block'} h-full`}>
          {slides?.map((slide, index) => {
            return (
              <div key={index} className={`relative embla-slide group flex-shrink-0 h-full group/slide ${slideWidthClass} mr-4`} style={{ '--slide-size': slideSize } as React.CSSProperties}>
                <div className="relative w-full h-full slide-group">
                  {slide.files.map((file: string, idx: number) => (
                    <Image key={idx} src={file} alt={slide.title} fill className="embla-slide-img transition-all duration-300 object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrow Buttons */}
      {showArrows && initSlider && (
        <>
          <button className="embla-slide-btn left-4 group-hover/arrows:opacity-100 transition-all duration-300" onClick={scrollPrev}>
            <ArrowLeft4Icon size="32" color="#fafafa" />
          </button>
          <button className="embla-slide-btn right-4 flex group-hover/arrows:opacity-100 transition-all duration-300 justify-center items-center" onClick={scrollNext}>
            <ArrowRight4Icon size="32" color="#fafafa" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && initSlider && (
        <>
          <div className="embla-slider-dots">
            {slides?.map((_, index) => (
              <div key={index} className={`embla-slider-dot ${selectedIndex === index ? 'bg-primary-500' : 'bg-grey-50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GeneralSlider;
