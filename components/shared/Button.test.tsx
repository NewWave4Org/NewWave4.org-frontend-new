import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Donate now</Button>);

    expect(screen.getByRole('button', { name: 'Donate now' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled and does not fire onClick when the disabled prop is set', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Submit
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('merges a custom className with the generated variant/size classes', () => {
    render(
      <Button variant="secondary" size="small" className="custom-class">
        Submit
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button.className).toContain('custom-class');
    expect(button.className).toContain('border-primary-500');
  });
});
