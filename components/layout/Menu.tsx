'use client';

import { getAllArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { useEffect, useState } from 'react';
import ArrowDown4Icon from '../icons/navigation/ArrowDown4Icon';
import { useLocale, useTranslations } from 'next-intl';
import { EN_LOCALE, Link, usePathname } from '@/i18n';
import { useAnchorScroll } from './useAnchorScroll';

const Menu = ({ handleToggleMenu }: { handleToggleMenu?: () => void }) => {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const { scrollToAnchor } = useAnchorScroll();

  const dispatch = useAppDispatch();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const menuLinks = [
    { href: `/`, label: t('menu.home') },
    { href: `/about`, label: t('menu.about_us') },
    { href: '#', label: t('menu.projects'), subMenu: true },
    { href: `/news`, label: t('menu.news') },
    { href: `/events`, label: t('menu.events') },
    { href: `/contacts`, label: t('menu.contacts') },
  ];

  const projects = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].items);
  const projectsStatus = useAppSelector(state => state.articleContent.byType[ArticleTypeEnum.PROJECT].status);

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
        {menuLinks.map(({ href, label, subMenu }) => {
          const isProjectsActive = pathname.startsWith('/projects');
          const activeStyle = subMenu ? (isProjectsActive ? 'active-link' : '') : pathname === href ? 'active-link' : '';

          if (subMenu) {
            return (
              <li key={label} className=" py-1 before:content-none pl-0 !mb-0 !static">
                <button className={`menu-link flex items-center gap-1 !p-0 ${activeStyle}`} onClick={() => setOpenSubMenu(prev => (prev === label ? null : label))}>
                  {label}
                  <ArrowDown4Icon className={`${openSubMenu === label ? 'rotate-180' : ''} duration-500 mt-1.5`} />
                </button>

                {openSubMenu === label && (
                  <div className="submenu lg:absolute top-full left-0 bg-primary-100 w-full z-50">
                    <div className="container mx-auto px-4">
                      <ul className="flex lg:items-center lg:flex-row flex-col lg:overflow-auto mb-1 submenu-ul">
                        {projectsStatus === 'loading' ? (
                          <li className="px-4 py-2 font-medium text-font-accent text-base before:content-none !mb-0 !static">
                            {t('loading')}
                          </li>
                        ) : projects.length > 0 ? (
                          projects.map(project => {
                            const currentHash = window.location.hash.replace('#project-', '');
                            const isActive = currentHash === project.id.toString();

                            return (
                              <li key={project.id} className="before:content-none pl-0 !mb-0 !static">
                                <Link
                                  scroll={false}
                                  href={{
                                    pathname: '/projects',
                                    hash: `project-${project.id}`,
                                  }}
                                  onClick={() => {
                                    const hash = `project-${project.id}`;

                                    history.pushState(null, '', `#${hash}`);

                                    setOpenSubMenu(null);
                                    handleToggleMenu?.();

                                    setTimeout(() => {
                                      scrollToAnchor(hash);
                                    }, 50);
                                  }}
                                  className={`block pb-2.5 p-2 lg:mx-4 text-base font-medium text-font-accent hover:text-font-secondary duration-500 ${isActive ? 'text-font-accent underline' : ''} whitespace-nowrap`}
                                >
                                  {locale === EN_LOCALE ? project.titleEng : project.title}
                                </Link>
                              </li>
                            );
                          })
                        ) : (
                          <li className="px-4 py-2 before:content-none text-center text-base font-medium text-font-accent !mb-0 !static">
                            {t('menu.emprty_projects')}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          }

          return (
            <li key={href} className="py-1 before:content-none pl-0 !mb-0">
              <Link className={`menu-link ${activeStyle}`} href={href} onClick={() => {setOpenSubMenu(null); handleToggleMenu?.();}}>
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
