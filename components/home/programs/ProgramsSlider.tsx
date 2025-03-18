'use client';

import { useEffect, useState } from 'react';
import ArrowLeft4Icon from '../../icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '../../icons/navigation/ArrowRight4Icon';
import ProgramCard from './ProgramCard';
import { useRouter } from 'next/navigation';
import slidesData from './programSlidesData';

const ProgramsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateSlides = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  const handleDetailsBtnClick = (index: number) => {
    router.push(slidesData[index].link);
  };
  const handleDonateBtnClick = () => {
    router.push('/donation');
  };

  const scrollNext = () => {
    setCurrentIndex(prev => (prev + 1) % slidesData.length);
  };

  const scrollPrev = () => {
    setCurrentIndex(prev => (prev - 1 + slidesData.length) % slidesData.length);
  };

  const getPosition = (index: number) => {
    const diff = (index - currentIndex + slidesData.length) % slidesData.length;

    if (isMobile) {
      return diff === 0 ? 'z-10 opacity-100 translate-x-0' : 'hidden';
    }

    if (diff === 0)
      return 'z-10 opacity-100 translate-x-0 translate-y-[25px] transition-all duration-700';
    if (diff === 1)
      return 'z-0 translate-x-[85%] filter blur-[2px] opacity-90 transition-all duration-700';
    if (diff === slidesData.length - 1)
      return 'z-0 -translate-x-[85%] filter blur-[2px] opacity-90 transition-all duration-700';
    return 'hidden';
  };

  return (
    <div className="relative w-full max-w-[969px] h-[535px] mx-auto flex items-center justify-center">
      {isMobile && (
        <button className="slide-btn left-0" onClick={scrollPrev}>
          <ArrowLeft4Icon size="32" color="#fafafa" />
        </button>
      )}
      <div className="relative flex justify-center items-center w-full h-full rounded-lg">
        {slidesData.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-[360px] rounded-t-lg h-full flex items-center justify-center cursor-pointer ${getPosition(
              index,
            )}`}
            onClick={() => setCurrentIndex(index)}
          >
            <ProgramCard
              key={index}
              slide={slide}
              index={index}
              handleDetailsBtnClick={handleDetailsBtnClick}
              handleDonateBtnClick={handleDonateBtnClick}
            />
          </div>
        ))}
      </div>
      {isMobile && (
        <button
          className="slide-btn right-0 flex justify-center items-center"
          onClick={scrollNext}
        >
          <ArrowRight4Icon size="32" color="#fafafa" />
        </button>
      )}
    </div>
  );
};

export default ProgramsSlider;
