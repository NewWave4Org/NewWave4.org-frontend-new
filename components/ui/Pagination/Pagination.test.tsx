import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
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
});
