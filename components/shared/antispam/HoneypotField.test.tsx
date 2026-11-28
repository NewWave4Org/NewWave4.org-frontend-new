import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HoneypotField from './HoneypotField';

describe('HoneypotField', () => {
  it('isHiddenFromUsers', () => {
    const { container } = render(<HoneypotField value="" onChange={vi.fn()} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.id).not.toBe('');
    expect(input.tabIndex).toBe(-1);
    expect(input.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('usesANonSemanticNameAndOptsOutOfAutofill', () => {
    const { container } = render(<HoneypotField value="" onChange={vi.fn()} />);
    const input = container.querySelector('input') as HTMLInputElement;
    // "website" is a field identity/password managers autofill.
    expect(input.name).toBe('nw_hp');
    expect(input.autocomplete).toBe('off');
    expect(input).toHaveAttribute('data-1p-ignore');
    expect(input).toHaveAttribute('data-lpignore', 'true');
    expect(input).toHaveAttribute('data-form-type', 'other');
  });

  it('passesTheTypedStringToOnChange', () => {
    const onChange = vi.fn();
    const { container } = render(
      <HoneypotField value="" onChange={onChange} />,
    );
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'spam.example' } });
    expect(onChange).toHaveBeenCalledWith('spam.example');
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
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });
});
