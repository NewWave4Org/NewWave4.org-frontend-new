'use client';

const NewsQuote = () => {
  return (
    <div className="NewsQuoteBlock lg:max-w-[1035px] py-[50px] mx-auto md:max-w-full mb-[40px]">
      {/* <div className="NewsQuoteBlock__inner bg-grey-50 rounded-lg shadow-custom relative" data-bgBefore={`${prefix}/icons/NewsQuoteTop.svg`} data-bgAfter={`${prefix}/icons/NewsQuoteBottom.svg`}> */}
      <div className="NewsQuoteBlock__inner bg-grey-50 rounded-lg shadow-custom relative 
        after:absolute after:inset-0 
        after:bg-[url(/icons/NewsQuoteTop.svg)] 
        after:content-[''] after:w-[104px] 
        after:h-[104px] after:top-[-52px] 
        after:right-[40px] after:left-auto
        before:absolute before:inset-0
        before:bg-[url(/icons/NewsQuoteBottom.svg)] 
        before:content-[''] before:w-[104px] 
        before:h-[104px] before:bottom-[-52px] before:top-auto
        before:left-[40px] before:right-auto
      ">

        <div className="NewsQuoteBlock__content text-center text-font-primary text-quote p-[32px] lg:max-w-[612px] md:max-w-full mx-auto">
          «Світ стикається з викликами, які вимагають не тільки швидких рішень, але й глобальної єдності. Україна сьогодні несе на собі важкий тягар війни, але це також випробування для всього цивілізованого світу. Ми повинні бути голосом тих, хто цього потребує».
        </div>
      </div>
    </div>
  );
};

export default NewsQuote;