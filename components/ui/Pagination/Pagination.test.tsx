import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Pagination from './Pagination';

// jsdom has no matchMedia. Default to a desktop viewport; phone tests flip it.
function stubViewport(isPhone: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: isPhone,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('Pagination', () => {
  beforeEach(() => stubViewport(false));
  afterEach(() => vi.restoreAllMocks());

  it('every page control is a 44px target on phones', () => {
    render(
      <Pagination totalPages={10} currentPage={5} onPageChange={vi.fn()} />,
    );

    const controls = screen.getAllByRole('button');
    expect(controls.length).toBeGreaterThan(0);
    for (const control of controls) {
      expect(control).toHaveClass('max-md:min-h-11', 'max-md:min-w-11');
    }
  });

  it('hides the ellipsis from assistive tech', () => {
    const { container } = render(
      <Pagination totalPages={10} currentPage={5} onPageChange={vi.fn()} />,
    );

    const ellipses = Array.from(container.querySelectorAll('span')).filter(
      span => span.textContent === '...',
    );
    expect(ellipses).toHaveLength(1);
    expect(ellipses[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('lets the row wrap on phones as a safety net', () => {
    render(
      <Pagination totalPages={10} currentPage={5} onPageChange={vi.fn()} />,
    );

    expect(screen.getByRole('navigation')).toHaveClass('max-md:flex-wrap');
  });

  it('keeps the full page window on desktop', () => {
    render(
      <Pagination totalPages={10} currentPage={5} onPageChange={vi.fn()} />,
    );

    // prev, 1, 2, break, 5, 6 (current), 7, 8, 9, 10, next
    expect(screen.getAllByRole('button')).toHaveLength(11);
  });

  it('renders at most 7 controls on phones so 44px targets fit one row', () => {
    stubViewport(true);
    render(
      <Pagination totalPages={10} currentPage={5} onPageChange={vi.fn()} />,
    );

    // prev, 1, break, current, break, 10, next. 7 * 44px + 6 * 8px = 356px,
    // which fits the 358px row on a 390px phone with px-4 gutters.
    const controls = screen.getAllByRole('button');
    expect(controls.length).toBeLessThanOrEqual(7);
    expect(
      screen.getByRole('button', { name: 'Page 6 is your current page' }),
    ).toBeInTheDocument();
  });
});
