'use client';

import Image from 'next/image';
import Slider, { Settings } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SampleNextArrow, SamplePrevArrow } from './SlickSlider/Arrows/Arrows';
import SliderDots from './SlickSlider/Dots/SliderDots';
import { useEffect } from 'react';

import "@fancyapps/ui/dist/fancybox/fancybox.css";

export interface SliderCarousel {
  files: string[];
}

interface ISlickCarouselProps extends Settings {
  slides: { files: string[] };
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
  responsive?: any[];
  variableWidth?: boolean;
  parentClass?: string;
  zoomIcon?: boolean;
  fancyBoxGallery?: boolean;
}

const SlickCarousel = ({
  slides,
  speed = 400,
  infinite = true,
  slideHover = true,
  autoplay = false,
  slidesToShow = 1,
  customStyles = '',
  centerMode = false,
  showArrows = false,
  dots = false,
  slideStyles = '',
  centerPadding = '0',
  customStyle = 'h-[200px] md:h-[524px]',
  responsive = [],
  variableWidth = false,
  parentClass = '',
  zoomIcon = false,
  fancyBoxGallery = false
}: ISlickCarouselProps) => {
  const settings = {
    className: 'h-full',
    infinite: infinite,
    speed: speed,
    dots: dots,
    appendDots: dots
      ? (dotsElements: React.ReactNode) => <SliderDots dots={dotsElements} />
      : undefined,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    pauseOnHover: slideHover,
    slidesToShow: slidesToShow,
    variableWidth: variableWidth,
    arrows: showArrows,
    centerMode: centerMode,
    cssEase: 'linear',
    centerPadding: centerPadding,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: responsive,
  };

  useEffect(() => {
    if (!fancyBoxGallery) return
    return () => {
      import('@fancyapps/ui/dist/fancybox/').then(({ Fancybox }) => {
        Fancybox.close()
      })
    }
  }, [fancyBoxGallery])

  return (
    <section className="relative group/arrows">
      <div className={`overflow-hidden ${customStyles} ${parentClass}`}>
        <Slider {...settings}>
          {slides?.files.map((slide, index) => (
            <div className={`${customStyle} relative group/slide group`} key={index}>
              <div className={`h-full ${slideStyles}`}>
                {fancyBoxGallery ? (
                  <>
                    <a
                      href={slide}
                      onClick={(e) => {
                        e.preventDefault()
                        import('@fancyapps/ui/dist/fancybox/').then(({ Fancybox }) => {
                          Fancybox.show(
                            slides.files.map(src => ({ src, type: 'image' })),
                            { 
                              startIndex: index,
                              Carousel: {
                                Thumbs: false,
                              }
                            }
                          )
                        })
                      }}
                    >
                      <Image src={slide} alt={`slider-${index}`} fill className={`rounded-xl object-contain ${customStyle}`} />
                      {zoomIcon && (
                        <button
                          type="button"
                          className="zoomIn__btn"
                        >
                          <svg className="zoomIn__icon" width="24" height="24"><use href="/icons/zoom-in-icon.svg#zoom-in"></use></svg>
                        </button>
                      )}
                    </a>
                    
                  </>
                ) : (
                  <Image src={slide} alt={`slider-${index}`} fill className={`rounded-xl object-contain ${customStyle}`} />
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SlickCarousel;
