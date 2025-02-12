import Link from 'next/link';
import Logo from './Logo';
import Menu from './Menu';
import ArrowDown4Icon from './icons/navigation/ArrowDown4Icon';

const Header = () => {
  return (
    <header className="header">
      <Logo />
      <Menu />
      <div className="flex items-center lg:order-2 gap-x-4">
        <button type="button" className="language-btn">
          UA
          <ArrowDown4Icon size="16" />
        </button>
        <Link href="/donation" className="donate-btn">
          Donate
        </Link>
      </div>
    </header>
  );
};

export default Header;
