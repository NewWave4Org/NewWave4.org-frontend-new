'use client';

import { getAllArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ArrowDown4Icon from '../icons/navigation/ArrowDown4Icon';

const Menu = ({ handleToggleMenu }: { handleToggleMenu?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const projects = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].items);
  const projectsStatus = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].status);

  const scrollToElementWithHeaderOffset = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.querySelector('header');
    const headerHeight = header?.offsetHeight || 0;

    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  useEffect(() => {
    const load = async () => {
      if (projectsStatus === 'idle') {
        await dispatch(
          getAllArticle({
            page: 0,
            articleType: ArticleTypeEnum.PROJECT,
            articleStatus: ArticleStatusEnum.PUBLISHED,
          }),
        );
      }
    };

    load();
  }, [projectsStatus, dispatch]);

  return (
    <nav className="justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
      <ul className="flex gap-x-8 text-large font-helv menu__items list-none">
        {[
          { href: '/', label: 'Головна' },
          { href: '/about', label: 'Про нас' },
          { href: '#', label: 'Проєкти', subMenu: true },
          { href: '/news', label: 'Новини' },
          { href: '/events', label: 'Події' },
          { href: '/contacts', label: 'Контакти' },
        ].map(({ href, label, subMenu }) => {
          // const activeStyle = pathname === href ? 'active-link' : '';

          const isProjectsActive = pathname.startsWith('/projects');
          const activeStyle = subMenu ? (isProjectsActive ? 'active-link' : '') : pathname === href ? 'active-link' : '';

          if (subMenu) {
            return (
              <li key={label} className=" py-1 before:content-none pl-0">
                <button className={`menu-link flex items-center gap-1 ${activeStyle}`} onClick={() => setOpenSubMenu(prev => (prev === label ? null : label))}>
                  {label}
                  <ArrowDown4Icon className={`${openSubMenu === label ? 'rotate-180' : ''} duration-500`} />
                </button>

                {openSubMenu === label && (
                  <div className="submenu lg:absolute top-full left-0 bg-primary-100 w-full z-50">
                    <div className="container mx-auto px-4">
                      <ul className="flex lg:items-center lg:flex-row flex-col lg:overflow-auto mb-1 submenu-ul">
                        {projectsStatus === 'loading' ? (
                          <li className="px-4 py-2 text-gray-500 before:content-none">Loading...</li>
                        ) : projects.length > 0 ? (
                          projects.map(project => {
                            const currentHash = window.location.hash.replace('#project-', '');
                            const isActive = currentHash === project.id.toString();

                            return (
                              <li key={project.id} className="before:content-none">
                                <a
                                  href={`/projects#project-${project.id}`}
                                  onClick={e => {
                                    e.preventDefault();
                                    if (window.location.pathname !== '/projects') {
                                      router.push(`/projects#project-${project.id}`);
                                    } else {
                                      scrollToElementWithHeaderOffset(`project-${project.id}`);
                                      window.history.replaceState(null, '', `#project-${project.id}`);
                                    }
                                    setOpenSubMenu(null);
                                    handleToggleMenu?.();
                                  }}
                                  className={`block pb-2.5 p-2 lg:mx-4 text-base font-medium hover:text-font-secondary duration-500 ${isActive ? 'active-link' : ''} whitespace-nowrap`}
                                >
                                  {project.title}
                                </a>
                              </li>
                            );
                          })
                        ) : (
                          <li className="px-4 py-2 text-gray-500">Немає проектів</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          }

          return (
            <li key={href} className="py-1 before:content-none pl-0">
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
