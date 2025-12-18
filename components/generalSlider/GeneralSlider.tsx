'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SampleNextArrow, SamplePrevArrow } from './Arrows/Arrows';
import SliderDots from './Dots/SliderDots';

export interface Slide {
  title: string;
  files: string[];
  description?: string;
  editorState?: any[];
  link: string;
}

interface GeneralSliderProps {
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
}

const GeneralSlider: React.FC<GeneralSliderProps> = ({
  slides,
  speed = 500,
  infinite = true,
  showArrows = true,
  slideHover = true,
  className = '',
  dots = true,
  autoplay = true,
  variableWidth = true,
  slidesToShow = 3,
}) => {
  const settings = {
    className: 'h-full',
    dots: dots,
    appendDots: dots ? (dotsElements: React.ReactNode) => <SliderDots dots={dotsElements} /> : undefined,
    infinite: infinite,
    speed: speed,
    slidesToScroll: 1,
    centerMode: true,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    pauseOnHover: slideHover,
    nextArrow: showArrows ? <SampleNextArrow /> : undefined,
    prevArrow: showArrows ? <SamplePrevArrow /> : undefined,
    ...(variableWidth ? { variableWidth: true } : { variableWidth: false, slidesToShow }),
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

  return (
    <div className={`${className} relative h-[420px] group/arrows`}>
      <div className="h-full w-full">
        <Slider {...settings}>
          {slides?.map((slide, index) => {
            const slideDescriptionText = convertDraftToHTML(slide?.editorState);

            const slideContent = (
              <div className="w-full h-full slide-group px-2">
                <div className="relative w-full h-full ">
                  {slide.files.map((file: string, idx: number) => (
                    <Image key={idx} src={file} alt={slide.title} fill className="embla-slide-img transition-all duration-300 object-cover rounded-xl" />
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
                      <div className="text-white text-base font-medium mb-1">{slide.title}</div>
                      <div className="text-grey-200 line-clamp-2 text-xs" dangerouslySetInnerHTML={{ __html: slideDescriptionText }} />
                    </div>
                  </div>
                </div>
              </div>
            );

            return (
              <div key={index} className={`relative group flex-shrink-0 h-full group/slide`} style={{ width: slides.length === 2 ? '100%' : '556px' }}>
                {typeof slide.link === 'string' && slide.link.trim() !== '' ? (
                  <Link href={slide.link} className="block h-full">
                    {slideContent}
                  </Link>
                ) : (
                  slideContent
                )}
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default GeneralSlider;
