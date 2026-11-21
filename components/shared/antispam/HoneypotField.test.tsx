import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HoneypotField from './HoneypotField';

describe('HoneypotField', () => {
  it('isHiddenFromUsers', () => {
    const { container } = render(<HoneypotField value="" onChange={vi.fn()} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.id).toBe('website');
    expect(input.name).toBe('website');
    expect(input.tabIndex).toBe(-1);
    expect(input.autocomplete).toBe('off');
    expect(input.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
