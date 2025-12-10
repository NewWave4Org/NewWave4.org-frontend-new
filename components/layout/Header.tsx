'use client';

import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import Menu from './Menu';
import ArrowDown4Icon from '../icons/navigation/ArrowDown4Icon';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Header = () => {
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
  }

  return (
    <>
      <header className={`header  ${isMenuShow ? 'menuOpen' : ''}`}>
        <div className="header__inner">
          <Logo />
          {!isMobile && (
            <div className={`flex items-center justify-between flex-1`}>
              <div className="mx-auto">
                <Menu />
              </div>
              <div className="flex items-center lg:order-2 gap-x-4">
                <div className="flex items-center">
                  <button type="button" className="language-btn bg-white/60 rounded-lg relative">
                    <span className="inline border-b border-primary-500 text-primary-500 font-medium text-xl">UA</span>
                    <Image src="/icons/ukraine.svg" width={32} height={32} alt="flag" />
                  </button>

                  <button type="button" className="language-btn bg-white/60 rounded-lg relative">
                    <Image src="/icons/united-states.svg" width={32} height={32} alt="flag" />
                    <span className="border-b opacity-0 hidden text-primary-500 font-medium text-xl">EN</span>
                  </button>
                </div>

                <Link href="/donation" className="donate-btn custom-donate-btn flex items-center">
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
          <Menu />
          <div className="flex items-start md:flex-row flex-col lg:order-2 gap-x-4 mt-5">
            <button type="button" className="language-btn md:mb-0 mb-3 bg-white/60 rounded-lg !w-[80px]">
              UA
              <ArrowDown4Icon size="16" color="#0F1B40" />
            </button>
            <Link href="/donation" className="donate-btn custom-donate-btn flex items-center">
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
