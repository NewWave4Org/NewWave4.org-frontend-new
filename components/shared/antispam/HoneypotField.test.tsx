import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HoneypotField from './HoneypotField';

describe('HoneypotField', () => {
  it('isHiddenFromUsers', () => {
    const { container } = render(<HoneypotField value="" onChange={vi.fn()} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.id).not.toBe('');
    expect(input.name).toBe('website');
    expect(input.tabIndex).toBe(-1);
    expect(input.autocomplete).toBe('off');
    expect(input.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('rendersUniqueIdsForMultipleInstances', () => {
    render(
      <>
        <HoneypotField value="" onChange={vi.fn()} />
        <HoneypotField value="" onChange={vi.fn()} />
      </>,
    );
    const inputs = screen.getAllByLabelText('Leave this field empty');
    expect(inputs).toHaveLength(2);
    expect(inputs.every(i => (i as HTMLInputElement).name === 'website')).toBe(
      true,
    );
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });
});
