import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '@/components/icons/navigation/ArrowRight4Icon';

export function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-slide-btn opacity-0 group-hover/arrows:opacity-100 !bg-primary-400 !w-[60px] !h-[60px] rounded-full transition-all duration-300 !flex justify-center items-center before:content-[''] before:hidden !right-4 z-[9]`}
      style={{ ...style }}
    >
      <button onClick={onClick}>
        <ArrowRight4Icon size="32" color="#fafafa" />
      </button>
    </div>
  );
}

export function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-slide-btn opacity-0 group-hover/arrows:opacity-100 !bg-primary-400 !w-[60px] !h-[60px] rounded-full transition-all duration-300 !flex justify-center items-center before:content-[''] before:hidden !left-4 z-[9]`}
      style={{ ...style }}
    >
      <button onClick={onClick}>
        <ArrowLeft4Icon size="32" color="#fafafa" />
      </button>
    </div>
  );
}
