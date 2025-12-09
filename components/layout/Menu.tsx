'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Menu = () => {
  const pathname = usePathname();
  return (
    <nav className="justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
      <ul className="flex gap-x-8 text-large font-helv menu__items">
        {[
          { href: '/', label: 'Головна' },
          { href: '/about', label: 'Про нас' },
          { href: '/projects', label: 'Проєкти' },
          { href: '/news', label: 'Новини' },
          { href: '/events', label: 'Події' },
          { href: '/contacts', label: 'Контакти' },
        ].map(({ href, label }) => {
          const activeStyle = pathname === href ? 'active-link' : '';
          return (
            <li key={href} className="py-1">
              <Link className={`menu-link ${activeStyle}`} href={href}>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Menu;
