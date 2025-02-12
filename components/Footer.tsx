import { prefix } from '@/utils/prefix';
import Logo from './Logo';
import Link from 'next/link';
import IconButton from './icons/IconButton';
import InstagramIcon from './icons/social/InstagramIcon';
import FacebookIcon from './icons/social/FacebookIcon';
import YoutubeIcon from './icons/social/YoutubeIcon';

const Footer = () => {
  const footerImgUrl = `${prefix}/footer.png`;
  return (
    <footer
      style={{
        backgroundImage: `url(${footerImgUrl})`,
        backgroundSize: 'cover',
      }}
      className="footer"
    >
      <Logo />
      <div className="footer-links">
        <Link className="menu-link py-1" href="/about">
          <span>Про нас</span>
        </Link>
        <Link className="menu-link py-1" href="">
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
          <IconButton href="">
            <InstagramIcon />
          </IconButton>
          <IconButton href="">
            <FacebookIcon />
          </IconButton>
          <IconButton href="">
            <YoutubeIcon />
          </IconButton>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
