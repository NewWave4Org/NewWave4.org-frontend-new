'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseInViewOptions {
  /** Stop observing after the first intersection (default: true). */
  once?: boolean;
  /** Passed straight to IntersectionObserver. */
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Reports whether an element has scrolled into the viewport, for
 * scroll-triggered entrance animations. Returns a callback ref so it works
 * with elements that mount late.
 *
 * Where IntersectionObserver doesn't exist the element is reported as
 * visible straight away — content must never stay hidden behind an
 * animation that has no way to start.
 */
export function useInView<T extends Element = HTMLElement>({
  once = true,
  rootMargin = '0px 0px -5% 0px',
  threshold = 0.1,
}: UseInViewOptions = {}) {
  const [element, setElement] = useState<T | null>(null);
  const [inView, setInView] = useState(false);

  const ref = useCallback((node: T | null) => setElement(node), []);

  useEffect(() => {
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting);
        if (visible) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, once, rootMargin, threshold]);

  return { ref, inView };
}
