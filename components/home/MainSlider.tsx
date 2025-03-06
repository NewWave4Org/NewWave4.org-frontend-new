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
    src: `${prefix}/slider/slide1.png`,
    srchover: `${prefix}/slider/slide1hover.png`,
    alt: 'Slide 1',
    title: 'Фестиваль «Разом до перемоги»',
    text: "Захід об'єднав українців та друзів України для збору коштів, культурного обміну та підтримки української спільноти, яка бореться за незалежність та мир",
    link: '/projects',
  },
  {
    id: 2,
    src: `${prefix}/slider/slide2.jpg`,
    srchover: `${prefix}/slider/slide2hover.png`,
    alt: 'Slide 2',
    title: 'Марш підтримки України у Вашингтоні',
    text: 'Українці та їхні союзники зібралися у столиці США на масовий Марш підтримки України, щоб привернути увагу до важливості міжнародної допомоги та продемонструвати єдність у боротьбі за свободу',
    link: '/projects',
  },
  {
    id: 3,
    src: `${prefix}/slider/slide3.jpg`,
    srchover: `${prefix}/slider/slide3hover.png`,
    alt: 'Slide 3',
    title: 'Співпраця УККА та Посла України до ООН',
    text: 'Представники Українського Конгресового Комітету Америки та Посол України до ООН Сергій Кислиця тісно співпрацювали протягом чотирьохрічної каденції, працюючи над посиленням підтримки України на міжнародній арені',
    link: '/projects',
  },
  {
    id: 4,
    src: `${prefix}/slider/slide4.png`,
    srchover: `${prefix}/slider/slide4hover.png`,
    alt: 'Slide 4',
    title: `Відкриття провулку Ukrainian Way на Брайтоні`,
    text: 'У Нью-Йорку відбулося урочисте відкриття провулку Ukrainian Way на Брайтон-Біч – символу єдності української громади та визнання внеску українців у культурне розмаїття США',
    link: '/projects',
  },
  {
    id: 5,
    src: `${prefix}/slider/slide5.jpg`,
    srchover: `${prefix}/slider/slide5hover.png`,
    alt: 'Slide 5',
    title: 'Зустріч із лідером демократів Чаком Шумером',
    text: 'Під час зустрічі з очільником демократів у Конгресі США Чаком Шумером обговорювалися питання підтримки України, фінансової допомоги та подальшої міжнародної взаємодії для забезпечення безпеки нашої держави',
    link: '/projects',
  },
];

const MainSlider: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 4000 }),
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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;
            const isHovered = hoveredSlide === slide.id;

            return (
              <div key={slide.id} className="relative embla-slide">
                <Image
                  src={isActive && isHovered ? slide.srchover : slide.src}
                  alt={slide.alt}
                  width={824}
                  height={544}
                  className="embla-slide-img transition-all duration-300"
                  priority={isActive}
                  onMouseEnter={() => isActive && setHoveredSlide(slide.id)}
                  onMouseLeave={() => isActive && setHoveredSlide(null)}
                  onClick={() => isActive && router.push(slide.link)}
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
      <button className="embla-slide-btn left-4" onClick={scrollPrev}>
        <ArrowLeft4Icon size="32" color="#fafafa" />
      </button>
      <button
        className="embla-slide-btn right-4 flex justify-center items-center"
        onClick={scrollNext}
      >
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
