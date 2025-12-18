'use client';

import Image from 'next/image';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface IEmblaCarouselProps {
  slides: { files: string[] };
  speed?: number;
  infinite?: boolean;
  slideHover?: boolean;
  autoplay?: boolean;
  className?: string;
  slidesToShow?: number;
}

const EmblaCarousel = ({ slides, speed = 400, infinite = true, slideHover = true, autoplay = true, slidesToShow = 1 }: IEmblaCarouselProps) => {
  const settings = {
    className: 'h-full',
    infinite: infinite,
    speed: speed,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    pauseOnHover: slideHover,
    slidesToShow: slidesToShow,
    showArrows: false,
  };

  return (
    <section className="relative">
      <div className="overflow-hidden max-w-[718px] h-[200px] md:h-[524px]">
        <Slider {...settings}>
          {slides?.files.map((slide, index) => (
            <div className="w-full h-[200px] md:h-[524px] relative" key={index}>
              <Image key={index} src={slide} alt={`slider-${index}`} fill className="rounded-xl object-cover w-full h-[200px] md:h-[524px]" />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default EmblaCarousel;
