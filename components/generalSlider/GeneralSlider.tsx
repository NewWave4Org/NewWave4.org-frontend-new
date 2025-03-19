'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ArrowLeft4Icon from '../icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '../icons/navigation/ArrowRight4Icon';

interface Slide {
  id: number,
  src: string,
  srchover: string,
  alt: string,
  link: string
}

interface GeneralSliderProps {
  slides: Slide[],
  autoplayDelay?: number,
  loop?: boolean,
  showArrows?: boolean,
  showDots?: boolean,
  slideHover?: boolean,
  hasLink?: boolean,
  fullWidth?: boolean
}

const GeneralSlider: React.FC<GeneralSliderProps> = ({slides, autoplayDelay = 4000, loop = true, showArrows = true, showDots = true, slideHover = true, hasLink = true, fullWidth = true}) => {

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: loop }, [
    Autoplay({ playOnInit: true, delay: autoplayDelay }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);
  const router = useRouter();
  
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
  
  return (
    <div className="relative embla group">
      <div className={`${!fullWidth ? 'overflow-hidden' : '' }`} ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;
            const isHovered = hoveredSlide === slide.id;

            return (
              <div key={slide.id} className="relative embla-slide">
                <Image
                  src={
                    slideHover
                      ? isActive && isHovered
                        ? slide.srchover
                        : slide.src
                      : slide.src
                  }
                  alt={slide.alt}
                  width={824}
                  height={544}
                  className="embla-slide-img transition-all duration-300"
                  priority={isActive}
                  onMouseEnter={() => isActive && setHoveredSlide(slide.id)}
                  onMouseLeave={() => isActive && setHoveredSlide(null)}
                  onClick={hasLink ? () => isActive && router.push(slide.link) : undefined}
                  style={{
                    cursor: isActive ? 'pointer' : 'default',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>


      {/* Arrow Buttons */}
      {showArrows && (
        <>
          <button className="embla-slide-btn left-4" onClick={scrollPrev}>
            <ArrowLeft4Icon size="32" color="#fafafa" />
          </button>
          <button
            className="embla-slide-btn right-4 flex justify-center items-center"
            onClick={scrollNext}
          >
            <ArrowRight4Icon size="32" color="#fafafa" />
          </button>
        </>
      )}


      {/* Dots */}
      {showDots && (
          <>
            <div className="embla-slider-dots">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`embla-slider-dot ${
                    selectedIndex === index ? 'bg-primary-500' : 'bg-grey-50'
                  }`}
                />
              ))}
            </div>
          </>
      )}
    </div>
  );
};

export default GeneralSlider;