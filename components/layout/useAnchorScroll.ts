'use client';

import { useCallback } from 'react';

export const useAnchorScroll = () => {
  const scrollToAnchor = useCallback((id: string) => {
    if (!id) return;

    const scroll = () => {
      const el = document.getElementById(id);
      if (!el) return;

      const header = document.querySelector('header');
      const headerHeight = header?.getBoundingClientRect().height ?? 0;

      const elementY = el.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementY - headerHeight,
        behavior: 'smooth',
      });
    };

    scroll();
  }, []);

  return { scrollToAnchor };
};
