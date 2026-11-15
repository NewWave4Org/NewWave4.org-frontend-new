// On phones each dot is a 44px button: padding plus a content-box background
// keep the visible dot 12px. The row sits on the slider's bottom edge, level
// with the arrows, clear of the slide caption. Every class needs `!`: the dot
// colours are unlayered CSS and .embla-slider-dots sits late in the utilities
// layer.
const PHONE_DOTS =
  'max-md:!bottom-2 max-md:!py-0 max-md:!px-1 max-md:!space-x-2 ' +
  'max-md:[&_li_button]:!size-11 max-md:[&_li_button]:!p-4 max-md:[&_li_button]:!bg-clip-content';

function SliderDots({ dots }: { dots: React.ReactNode }) {
  return (
    <div className="">
      <ul className={`list-none embla-slider-dots ${PHONE_DOTS}`}>{dots}</ul>
    </div>
  );
}

export default SliderDots;
