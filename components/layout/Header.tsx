'use client';

import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import Menu from './Menu';
import ArrowDown4Icon from '../icons/navigation/ArrowDown4Icon';
import { useEffect, useState } from 'react';

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuShow, setisMenuShow] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    function handleMobile() {
      const windowWidth = window.innerWidth;
      if(windowWidth <= 1024) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    handleMobile();

    window.addEventListener('resize', handleMobile);

    return() => {
      window.removeEventListener('resize', handleMobile);
    };
  }, []);

  function handleToggleMenu() {
    setisMenuShow(prev => !prev);
    setIsActive(prev => !prev);
  }

  return (
    <>
      <header className={` header header-position ${isMenuShow ? 'menuOpen' : ''}`}>

          <Logo />
          {!isMobile &&
            <div className={`flex items-center justify-between flex-1`}>
              <div className='mx-auto'>
                <Menu />
              </div>
              <div className="flex items-center lg:order-2 gap-x-4">
                <button type="button" className="language-btn">
                  UA
                  <ArrowDown4Icon size="16" color="#0F1B40" />
                </button>
                <Link href="/donation" className="donate-btn">
                  Donate
                </Link>
              </div>
            </div>
          }
          {isMobile && 
            <div className={`hamburger hamburger--squeeze ${isActive ? 'is-active' : ''}`} onClick={handleToggleMenu}>
              <span className="hamburger-box">
                <div className="hamburger-inner"></div>
              </span>
            </div>
          }

        
      </header>

      {isMobile &&
        <div className={`${isMobile ? 'headerMobile' : ''} ${isMenuShow ? 'headerShowMobile' : ''}`}>
          <Menu />
          <div className="flex items-center lg:order-2 gap-x-4">
            <button type="button" className="language-btn">
              UA
              <ArrowDown4Icon size="16" color="#0F1B40" />
            </button>
            <Link href="/donation" className="donate-btn">
              Donate
            </Link>
          </div>
        </div>
      }
    </>
  );
};

export default Header;
