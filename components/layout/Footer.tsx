'use client';
import Logo from '@/components/layout/Logo';
import Link from 'next/link';
import IconButton from '../icons/IconButton';
import InstagramIcon from '../icons/social/InstagramIcon';
import FacebookIcon from '../icons/social/FacebookIcon';
import YoutubeIcon from '../icons/social/YoutubeIcon';

const Footer = () => {
  return (
    <footer className="footer">
      <Logo />
      <div className="footer-links">
        <Link className="menu-link py-1" href="/about">
          <span>Про нас</span>
        </Link>
        <Link
          className="menu-link py-1"
          href="https://newwaveschool.org/"
          target="_blank"
        >
          <span>Школа &ldquo;Нова Хвилька&rdquo;</span>
        </Link>
      </div>
      <div className="footer-links">
        <Link className="menu-link py-1" href="/news">
          <span>Новини</span>
        </Link>
        <Link className="menu-link py-1" href="/contacts">
          <span>Контакти</span>
        </Link>
      </div>
      <div className="flex flex-col items-center lg:order-3 gap-x-4 gap-y-4">
        <p className="text-small text-grey-700">Стежте за нами:</p>
        <div className="flex gap-x-2">
          <IconButton
            onClick={() =>
              window.open(
                'https://www.instagram.com/newwavebrooklynschool?igsh=MXd3cXdwN3JzcGtuMQ==',
              )
            }
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              window.open(
                'https://www.facebook.com/profile.php?id=100068772616023',
              )
            }
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              window.open(
                'https://youtube.com/@ukrainiannewwave627?si=T6tZNSsKsR0JKlPZ',
              )
            }
          >
            <YoutubeIcon />
          </IconButton>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
