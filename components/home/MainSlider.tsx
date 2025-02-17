'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ArrowLeft4Icon from '../icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '../icons/navigation/ArrowRight4Icon';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { prefix } from '@/utils/prefix';

const slides = [
  {
    id: 1,
    src: `${prefix}/slider/slide1.jpg`,
    alt: 'Slide 1',
    title: 'Нагорода “Жінка-новатор року”',
    text: 'Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”',
    link: '/projects',
  },
  {
    id: 2,
    src: `${prefix}/slider/slide2.jpg`,
    alt: 'Slide 2',
    title: 'Нагорода “Жінка-новатор року”',
    text: 'Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”',
    link: '/projects',
  },
  {
    id: 3,
    src: `${prefix}/slider/slide3.png`,
    alt: 'Slide 3',
    title: 'Нагорода “Жінка-новатор року”',
    text: 'Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”',
    link: '/projects',
  },
  {
    id: 4,
    src: `${prefix}/slider/slide4.jpg`,
    alt: 'Slide 4',
    title: 'Нагорода “Жінка-новатор року”',
    text: 'Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”',
    link: '/projects',
  },
  {
    id: 5,
    src: `${prefix}/slider/slide5.jpg`,
    alt: 'Slide 5',
    title: 'Нагорода “Жінка-новатор року”',
    text: 'Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року”  Нагорода “Жінка-новатор року” Нагорода “Жінка-новатор року”',
    link: '/projects',
  },
];

const MainSlider: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 4000 }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative embla-slide">
              <Image
                src={slide.src}
                alt={slide.alt}
                width={824}
                height={544}
                className="embla-slide-img"
                priority={index === 0}
              />
              <div
                className={`embla-slide-text-container
                           ${
                             index === selectedIndex
                               ? 'group-hover:opacity-100 group-hover:backdrop-blur-[18.6px] group-hover:backdrop-opacity-85'
                               : ''
                           }`}
                onClick={() => router.push(slide.link)}
              >
                <div
                  className={`embla-slide-inner-text
                    ${index === selectedIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                  <h4 className="text-h4 text-white">{slide.title}</h4>
                  <p className="text-small text-grey-200">{slide.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow Buttons */}
      <button className="embla-slide-btn left-4" onClick={scrollPrev}>
        <ArrowLeft4Icon size="32" color="#fafafa" />
      </button>
      <button className="embla-slide-btn right-4" onClick={scrollNext}>
        <ArrowRight4Icon size="32" color="#fafafa" />
      </button>

      {/* Dots */}
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
    </div>
  );
};

export default MainSlider;
