import { prefix } from '@/utils/prefix';
import React from 'react';

const Quote = ({ quote }: { quote: string }) => {
  const bgTopUrl = `${prefix}/icons/NewsQuoteTop.svg`;
  const bgBottomUrl = `${prefix}/icons/NewsQuoteBottom.svg`;
  return (
    <div className="NewsQuoteBlock lg:max-w-[1035px] py-[50px] mx-auto md:max-w-full mb-[40px]">
      <div className="NewsQuoteBlock__inner bg-grey-50 rounded-lg shadow-custom relative">
        <div className={`NewsQuoteBlock__innerTop absolute top-[-52px] right-[40px] w-[104px] h-[104px]`} style={{backgroundImage: `url(${bgTopUrl})`}}></div>
        <div className="NewsQuoteBlock__content text-center text-font-primary text-quote p-[32px] lg:max-w-[612px] md:max-w-full mx-auto">
          {quote}
        </div>
        <div className="NewsQuoteBlock__innerBottom absolute bottom-[-52px] left-[40px] w-[104px] h-[104px]" style={{backgroundImage: `url(${bgBottomUrl})`}}></div>
      </div>
    </div>
  );
};

export default Quote;