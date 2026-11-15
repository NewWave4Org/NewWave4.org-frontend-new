// On phones each dot is a 44px button: padding plus a content-box background
// keep the visible dot 12px. The row sits in normal flow under the slides
// (the caption is under the image there), level with the arrows. Every class
// needs `!`: the dot colours are unlayered CSS and .embla-slider-dots sits
// late in the utilities layer. Off the photo, the inactive white dots would
// vanish against the page, so they are grey there (as in the programs slider).
const PHONE_DOTS =
  'max-md:!static max-md:!translate-x-0 max-md:mx-auto max-md:w-fit ' +
  'max-md:!py-0 max-md:!px-1 max-md:!space-x-2 ' +
  'max-md:[&_li_button]:!size-11 max-md:[&_li_button]:!p-4 max-md:[&_li_button]:!bg-clip-content ' +
  'max-md:[&_li:not(.slick-active)_button]:!bg-grey-200';

function SliderDots({ dots }: { dots: React.ReactNode }) {
  return (
    <div className="">
      <ul className={`list-none embla-slider-dots ${PHONE_DOTS}`}>{dots}</ul>
    </div>
  );
}

export default SliderDots;
