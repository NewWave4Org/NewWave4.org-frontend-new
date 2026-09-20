import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInView } from './useInView';

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let observe: ReturnType<typeof vi.fn>;
let disconnect: ReturnType<typeof vi.fn>;
let lastCallback: IOCallback | undefined;
const originalIO = globalThis.IntersectionObserver;

beforeEach(() => {
  observe = vi.fn();
  disconnect = vi.fn();
  lastCallback = undefined;
  globalThis.IntersectionObserver = class {
    constructor(cb: IOCallback) {
      lastCallback = cb;
    }
    observe = observe;
    disconnect = disconnect;
    unobserve = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  globalThis.IntersectionObserver = originalIO;
});

function renderWithElement(options?: Parameters<typeof useInView>[0]) {
  const el = document.createElement('div');
  const hook = renderHook(() => useInView<HTMLDivElement>(options));
  act(() => {
    hook.result.current.ref(el);
  });
  return { hook, el };
}

describe('useInView', () => {
  it('starts out-of-view and observes the element once a ref is attached', () => {
    const { hook, el } = renderWithElement();

    expect(hook.result.current.inView).toBe(false);
    expect(observe).toHaveBeenCalledWith(el);
  });

  it('flips to in-view when the observer reports an intersection', () => {
    const { hook } = renderWithElement();

    act(() => lastCallback?.([{ isIntersecting: true }]));

    expect(hook.result.current.inView).toBe(true);
  });

  it('stays in-view after leaving the viewport when once is set (the default)', () => {
    const { hook } = renderWithElement();

    act(() => lastCallback?.([{ isIntersecting: true }]));
    act(() => lastCallback?.([{ isIntersecting: false }]));

    expect(hook.result.current.inView).toBe(true);
    expect(disconnect).toHaveBeenCalled();
  });

  it('tracks leaving the viewport when once is false', () => {
    const { hook } = renderWithElement({ once: false });

    act(() => lastCallback?.([{ isIntersecting: true }]));
    act(() => lastCallback?.([{ isIntersecting: false }]));

    expect(hook.result.current.inView).toBe(false);
  });

  it('treats the element as visible when IntersectionObserver is unavailable', () => {
    // Old browsers and some test environments: never hide content behind an
    // animation that can't be triggered.
    globalThis.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;

    const { hook } = renderWithElement();

    expect(hook.result.current.inView).toBe(true);
  });
});
