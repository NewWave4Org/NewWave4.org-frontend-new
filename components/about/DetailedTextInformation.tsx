import React, { JSX } from 'react';

type DetailedTextInformationProps = {
  text: {
    top: JSX.Element[];
    bottom: JSX.Element[];
  };
};

const DetailedTextInformation = ({ text }: DetailedTextInformationProps) => {
  return (
    <section className='detailed-text-information'>
      <div className="container mx-auto">
        <div className="container__inner max-w-[1036px] mx-auto text-center bg-gray-50 p-8 my-[80px] shadow-[0px_4px_12px_0px_#B48C6426] font-medium text-lg text-font-accent font-helv relative after:absolute after:bg-[url('/background/decor-element-blue.svg')] after:bg-cover after:bg-no-repeat after:content-[''] after:w-[160px] after:h-[160px] after:top-[-50px] after:right-6 before:absolute before:bg-[url('/background/decor-element-yellow.svg')] before:bg-cover before:bg-no-repeat before:content-[''] before:w-[160px] before:h-[160px] before:bottom-[-50px] before:left-6">
          <div className="text flex flex-col gap-y-4 max-w-[612px] mx-auto">
            <div>{text.top}</div>
            <div>{text.bottom}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedTextInformation;