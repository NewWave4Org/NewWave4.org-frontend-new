'use client';

const NewsQuote = () => {
  return (
    <div className="NewsQuoteBlock lg:max-w-[1035px] py-[50px] mx-auto md:max-w-full mb-[40px]">
      <div className="NewsQuoteBlock__inner bg-grey-50 rounded-lg shadow-custom relative">
        <div className="NewsQuoteBlock__content text-center text-font-primary text-quote p-[32px] lg:max-w-[612px] md:max-w-full mx-auto">
          «Світ стикається з викликами, які вимагають не тільки швидких рішень, але й глобальної єдності. Україна сьогодні несе на собі важкий тягар війни, але це також випробування для всього цивілізованого світу. Ми повинні бути голосом тих, хто цього потребує».
        </div>
      </div>
    </div>
  );
};

export default NewsQuote;