'use client';

import Link from 'next/link';
import { SampleNextArrow, SamplePrevArrow } from './Arrows/Arrows';
import SliderDots from './Dots/SliderDots';
import Image from 'next/image';
import { convertDraftToHTML } from '@/components/TextEditor/utils/convertDraftToHTML';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCallback, useEffect, useState } from 'react';

export interface Slide {
  translatable_text_title: string;
  files: string[];
  translatable_text_description?: string;
  translatable_text_editorState?: any[];
  link: string;
}

interface HomeSliderProps {
  slides: Slide[];
  speed?: number;
  infinite?: boolean;
  showArrows?: boolean;
  dots?: boolean;
  slideHover?: boolean;
  hasLink?: boolean;
  autoplay?: boolean;
  variableWidth?: boolean;
  className?: string;
  slidesToShow?: number;
  locale?: string;
}

function HomeSlider({
  slides,
  speed = 400,
  infinite = true,
  showArrows = true,
  slideHover = true,
  className = '',
  dots = true,
  autoplay = true,
  variableWidth = true,
  slidesToShow = 3,
  locale,
}: HomeSliderProps) {
  const [isMobile, setIsMobile] = useState(false);
  // react-slick cannot lay itself out without measuring the DOM: rendered on
  // the server it emits an invalid track width, so until hydration the slides
  // showed as narrow strips and then jumped into place. The carousel is
  // therefore mounted on the client only, and a static, CSS-only copy of its
  // first frame is server-rendered and kept on top until slick has painted.
  const [mounted, setMounted] = useState(false);
  const [sliderReady, setSliderReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSliderInit = useCallback(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setSliderReady(true)),
    );
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sliderLength = slides.length;
  const isVariableWidth = sliderLength > 2 && variableWidth;
  const resolvedSlidesToShow = isVariableWidth
    ? undefined
    : sliderLength <= 2
      ? 1
      : slidesToShow;

  const settings = {
    className: 'h-full',
    dots: dots,
    appendDots: dots
      ? (dotsElements: React.ReactNode) => <SliderDots dots={dotsElements} />
      : undefined,
    infinite: infinite,
    speed: speed,
    slidesToScroll: 1,
    centerMode: !isMobile && sliderLength > 2,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    pauseOnHover: slideHover,
    nextArrow: showArrows ? <SampleNextArrow /> : undefined,
    prevArrow: showArrows ? <SamplePrevArrow /> : undefined,
    variableWidth: isVariableWidth,
    onInit: handleSliderInit,

    ...(resolvedSlidesToShow !== undefined && {
      slidesToShow: resolvedSlidesToShow,
    }),
    responsive: [
      {
        breakpoint: 640,
        settings: {
          variableWidth: false,
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  const renderSlideContent = (slide: Slide, eager: boolean) => {
    const slideDescriptionText = convertDraftToHTML(
      slide?.translatable_text_editorState,
    );

    const slideContent = (
      <div className="w-full h-full slide-group px-2">
        <div className="relative w-full h-full ">
          {slide.files.map((file: string, idx: number) => (
            <Image
              key={idx}
              src={file}
              alt={slide.translatable_text_title ?? 'photo'}
              fill
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : undefined}
              className="embla-slide-img transition-all duration-300 object-cover rounded-xl"
            />
          ))}

          <div
            className="
              absolute bottom-0 h-full w-full rounded-xl
              bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_80%,rgba(0,0,0,1)_100%)]
              lg:bg-none
              lg:bg-[rgba(0,0,0,0.5)]
              lg:opacity-0
              lg:invisible visible
              transition-all
              duration-300
              group-hover/slide:opacity-100
              group-hover/slide:visible
            "
          >
            <div className="max-w-[435px] mb-10 p-4 flex flex-col w-full h-[calc(100%-40px)] justify-end">
              <div className="text-white text-base font-medium mb-1">
                {slide.translatable_text_title}
              </div>
              <div
                className="text-grey-200 line-clamp-2 text-xs"
                dangerouslySetInnerHTML={{
                  __html: slideDescriptionText,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );

    return typeof slide.link === 'string' && slide.link.trim() !== '' ? (
      <Link href={`${locale}/${slide.link}`} className="block h-full">
        {slideContent}
      </Link>
    ) : (
      slideContent
    );
  };

  // First frame of the carousel, laid out with CSS only. With more than two
  // slides slick centres the first one and shows its neighbours either side
  // (one full-width slide below 640px); otherwise it shows one full-width slide.
  const hasSideSlides = sliderLength > 2;
  const placeholderSlides = hasSideSlides
    ? [
        { slide: slides[sliderLength - 1], center: false },
        { slide: slides[0], center: true },
        { slide: slides[1], center: false },
      ]
    : slides.slice(0, 1).map(slide => ({ slide, center: true }));

  return (
    <div className={`${className} relative h-[420px] group/arrows`}>
      {!sliderReady && sliderLength > 0 && (
        <div
          data-testid="home-slider-placeholder"
          className="absolute inset-0 z-10 flex justify-center overflow-hidden bg-skyBlue-300 px-4 lg:px-0"
        >
          {placeholderSlides.map(({ slide, center }, index) => (
            <div
              key={index}
              aria-hidden={center ? undefined : true}
              className={`relative h-full flex-shrink-0 group/slide ${
                center ? 'w-full' : 'hidden sm:block'
              } ${hasSideSlides ? 'sm:w-[556px]' : ''}`}
            >
              {renderSlideContent(slide, center)}
            </div>
          ))}
        </div>
      )}
      <div className="h-full w-full">
        {mounted && (
          <Slider {...settings}>
            {slides?.map((slide, index) => (
              <div
                key={index}
                className={`relative group flex-shrink-0 h-full group/slide`}
                style={{ width: sliderLength > 2 ? '556px' : '100%' }}
              >
                {renderSlideContent(slide, index === 0)}
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}

export default HomeSlider;
