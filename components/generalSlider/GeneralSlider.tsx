'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import ArrowLeft4Icon from '../icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '../icons/navigation/ArrowRight4Icon';
import Link from 'next/link';

interface Slide {
  title: string;
  files: [];
  description: string;
  editorState: any[];
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
}

const GeneralSlider: React.FC<GeneralSliderProps> = ({ slides, autoplayDelay = 4000, loop = true, showArrows = true, showDots = true }) => {
  const slideCount = slides.length;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: loop, align: slideCount == 2 ? 'start' : 'center' }, [Autoplay({ playOnInit: true, delay: autoplayDelay })]);
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
      ? 'w-[824px]' // 3+ slide
      : 'w-full flex-1 flex-shrink-0';

  const slideSize = slides.length === 2 ? '100%' : '824px';

  return (
    <div className="relative embla h-[544px] group/arrows">
      <div className="overflow-hidden" ref={initSlider ? emblaRef : null}>
        <div className={`${initSlider ? 'flex' : 'block'}`}>
          {slides?.map((slide, index) => {
            const slideContent = (
              <div className="relative w-full h-full slide-group">
                {slide.files.map((file: string, idx: number) => (
                  <Image key={idx} src={file} alt={slide.title} fill className="embla-slide-img transition-all duration-300 object-cover" />
                ))}
                <div
                  className="
                    absolute h-full w-full
                    backdrop-blur-[18.6px]
                    shadow-[inset_0_0_68px_0_rgba(255,255,255,0.05),inset_0_0_4px_0_rgba(255,255,255,0.15)]
                    bg-[rgba(15,27,64,0.5)]
                    opacity-0
                    invisible
                    transition-all
                    duration-300
                    group-hover/slide:opacity-100
                    group-hover/slide:visible
                  "
                >
                  <div className="max-w-[545px] pb-[100px] pl-[55px] flex flex-col w-full h-full justify-end">
                    <div className="text-white text-h4 mb-4 font-ebGaramond">{slide.title}</div>
                    <div className="text-grey-200">{slide.description}</div>
                  </div>
                </div>
              </div>
            );

            return (
              <div key={index} className={`relative embla-slide group flex-shrink-0 h-[544px] group/slide aspect-[824/544] ${slideWidthClass}`} style={{ '--slide-size': slideSize } as React.CSSProperties}>
                {typeof slide.link === 'string' && slide.link.trim() !== '' ? <Link href={slide.link}>{slideContent}</Link> : slideContent}
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
