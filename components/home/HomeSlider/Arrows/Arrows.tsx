import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '@/components/icons/navigation/ArrowRight4Icon';
import type { CustomArrowProps } from 'react-slick';

// From md the arrows are hover-revealed 60px circles centred on the slider's
// sides. On phones (no hover) they are always visible, 44px, and pinned to the
// bottom row beside the dots (see SliderDots), under the caption, so they
// stay off slide text.

export function SampleNextArrow(props: CustomArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-slide-btn md:opacity-0 md:group-hover/arrows:opacity-100 !bg-primary-400 !w-11 !h-11 md:!w-[60px] md:!h-[60px] max-md:!top-auto max-md:!bottom-0 max-md:!transform-none rounded-full transition-all duration-300 !flex justify-center items-center before:content-[''] before:hidden !right-4 z-[9]`}
      style={{ ...style }}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex size-full items-center justify-center"
      >
        <ArrowRight4Icon size="32" color="#fafafa" />
      </button>
    </div>
  );
}

export function SamplePrevArrow(props: CustomArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-slide-btn md:opacity-0 md:group-hover/arrows:opacity-100 !bg-primary-400 !w-11 !h-11 md:!w-[60px] md:!h-[60px] max-md:!top-auto max-md:!bottom-0 max-md:!transform-none rounded-full transition-all duration-300 !flex justify-center items-center before:content-[''] before:hidden !left-4 z-[9]`}
      style={{ ...style }}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex size-full items-center justify-center"
      >
        <ArrowLeft4Icon size="32" color="#fafafa" />
      </button>
    </div>
  );
}
