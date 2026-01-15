'use client';

import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import Menu from './Menu';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from 'next-intl';

const Header = ({currentLocale}: {currentLocale: string}) => {
  const locale = useLocale();

  const [isMobile, setIsMobile] = useState(false);
  const [isMenuShow, setisMenuShow] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    function handleMobile() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 1024) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    handleMobile();

    window.addEventListener('resize', handleMobile);

    return () => {
      window.removeEventListener('resize', handleMobile);
    };
  }, []);

  function handleToggleMenu() {
    setisMenuShow(prev => !prev);
    setIsActive(prev => !prev);

    if(isMobile) {
      document.querySelector('body')?.classList.toggle('menu-open');
    }
  }

  return (
    <>
      <header className={`header  ${isMenuShow ? 'menuOpen' : ''}`}>
        <div className="header__inner">
          <Logo locale={locale} />
          {!isMobile && (
            <div className={`flex items-center justify-between flex-1`}>
              <div className="mx-auto">
                <Menu handleToggleMenu={handleToggleMenu} />
              </div>
              <div className="flex items-center lg:order-2 gap-x-4">
                <LanguageSwitcher currentLocale={currentLocale} />

                <Link href="/donation" prefetch={false} className="donate-btn custom-donate-btn flex items-center">
                  Donate
                  <span className="ml-2 duration-500 w-[26px]">
                    <Image src="/icons/Icon_uk-heart.svg" width={26} height={22} alt="icon" />
                  </span>
                </Link>
              </div>
            </div>
          )}
          {isMobile && (
            <div className={`hamburger hamburger--squeeze ${isActive ? 'is-active' : ''}`} onClick={handleToggleMenu}>
              <span className="hamburger-box">
                <div className="hamburger-inner"></div>
              </span>
            </div>
          )}
        </div>
      </header>

      {isMobile && (
        <div className={`${isMobile ? 'headerMobile' : ''} ${isMenuShow ? 'headerShowMobile' : ''}`}>
          <Menu handleToggleMenu={handleToggleMenu} />
          <div className="flex items-start flex-col lg:order-2 gap-x-4 mt-5">

            <LanguageSwitcher currentLocale={currentLocale} />

            <Link href="/donation" className="donate-btn custom-donate-btn flex items-center mt-5">
              Donate
              <span className="ml-2 flex-1 duration-500  w-[26px]">
                <Image src="/icons/Icon_uk-heart.svg" width={26} height={22} alt="icon" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
