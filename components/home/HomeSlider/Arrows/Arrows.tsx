import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import ArrowRight4Icon from '@/components/icons/navigation/ArrowRight4Icon';

export function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={`${className} slick-slide-btn group-hover/arrows:opacity-100 transition-all duration-300 !flex justify-center items-center before:content-[''] before:hidden !right-4`} style={{ ...style }}>
      <button onClick={onClick}>
        <ArrowRight4Icon size="32" color="#fafafa" />
      </button>
    </div>
  );
}

export function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={`${className} slick-slide-btn group-hover/arrows:opacity-100 transition-all duration-300 !flex justify-center items-center before:content-[''] before:hidden !left-4`} style={{ ...style }}>
      <button onClick={onClick}>
        <ArrowLeft4Icon size="32" color="#fafafa" />
      </button>
    </div>
  );
}
