'use client';

import Image from 'next/image';
import Slider, { Settings } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SampleNextArrow, SamplePrevArrow } from './SlickSlider/Arrows/Arrows';
import SliderDots from './SlickSlider/Dots/SliderDots';

export interface SliderCarousel {
  files: string[]
}

interface IEmblaCarouselProps extends Settings {
  slides: {files: string[]};
  speed?: number;
  infinite?: boolean;
  slideHover?: boolean;
  autoplay?: boolean;
  className?: string;
  slidesToShow?: number;
  customStyles?: string;
  centerMode?: boolean;
  showArrows?: boolean;
  slideStyles?: string;
  centerPadding?: string;
  customStyle?: string;
  responsive?: any[]
}

const EmblaCarousel = ({ slides, speed = 400, infinite = true, slideHover = true, autoplay = true, slidesToShow = 1, customStyles = '', centerMode = false, showArrows = false, dots = false, slideStyles = '', centerPadding, customStyle = 'h-[200px] md:h-[524px]', responsive = [] }: IEmblaCarouselProps) => {

  const settings = {
    className: 'h-full',
    infinite: infinite,
    speed: speed,
    dots: dots,
    appendDots: dots ? (dotsElements: React.ReactNode) => <SliderDots dots={dotsElements} /> : undefined,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    pauseOnHover: slideHover,
    slidesToShow: slidesToShow,
    arrows: showArrows,
    centerMode: centerMode,
    cssEase: 'linear', 
    centerPadding: centerPadding,
    nextArrow:  <SampleNextArrow /> ,
    prevArrow:  <SamplePrevArrow />,
    responsive: responsive
  };

  return (
    <section className="relative group/arrows">
      <div className={`overflow-hidden ${customStyles}`}>
        <Slider {...settings}>
          {slides?.files.map((slide, index) => (
            <div className={`${customStyle} relative group/slide group`} key={index}>
              <div className={`h-full ${slideStyles}`}>
                <Image key={index} src={slide} alt={`slider-${index}`} fill className={`rounded-xl object-cover ${customStyle}`} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default EmblaCarousel;
