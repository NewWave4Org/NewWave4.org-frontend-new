import { prefix } from '@/utils/prefix';
import React from 'react';

const Quote = ({ quote, className }: { quote: string; className?: string }) => {
  const bgTopUrl = `${prefix}/icons/NewsQuoteTop.svg`;
  const bgBottomUrl = `${prefix}/icons/NewsQuoteBottom.svg`;
  return (
    <div className={`quoteBlock lg:max-w-[1035px] py-[50px] mx-auto md:max-w-full mb-[40px] ${className}`}>
      <div className="quoteBlock__inner bg-grey-50 rounded-lg shadow-custom relative">
        <div className={`quoteBlock__innerTop absolute top-[-52px] right-[40px] w-[104px] h-[104px]`} style={{ backgroundImage: `url(${bgTopUrl})` }}></div>
        <div className="quoteBlock__content text-center text-font-primary text-quote py-[48px] px-[15px] lg:max-w-[642px] md:max-w-full mx-auto">
          <div dangerouslySetInnerHTML={{ __html: quote }} />
        </div>
        <div className="quoteBlock__innerBottom absolute bottom-[-52px] left-[40px] w-[104px] h-[104px]" style={{ backgroundImage: `url(${bgBottomUrl})` }}></div>
      </div>
    </div>
  );
};

export default Quote;
