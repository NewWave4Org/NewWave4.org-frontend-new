import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { forwardRef, useImperativeHandle } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const resetMock = vi.fn();

vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: forwardRef(function FakeTurnstile(
    props: {
      onSuccess?: (t: string) => void;
      onExpire?: () => void;
      onError?: () => void;
    },
    ref,
  ) {
    useImperativeHandle(ref, () => ({ reset: resetMock }));
    return (
      <div data-testid="widget">
        <button onClick={() => props.onSuccess?.('tok')}>success</button>
        <button onClick={() => props.onExpire?.()}>expire</button>
        <button onClick={() => props.onError?.()}>error</button>
      </div>
    );
  }),
}));

import TurnstileField, { isTurnstileEnabled } from './TurnstileField';

describe('TurnstileField', () => {
  beforeEach(() => {
    resetMock.mockClear();
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', '1x00000000000000000000AA');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('rendersNothingWithoutSiteKey', () => {
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', '');
    const { container } = render(
      <TurnstileField value="" onChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(isTurnstileEnabled()).toBe(false);
  });

  it('is enabled when the key is present', () => {
    expect(isTurnstileEnabled()).toBe(true);
  });

  it('forwardsToken', async () => {
    const onChange = vi.fn();
    render(<TurnstileField value="" onChange={onChange} />);
    await userEvent.click(screen.getByText('success'));
    expect(onChange).toHaveBeenCalledWith('tok');
  });

  it('expiryClearsToken', async () => {
    const onChange = vi.fn();
    render(<TurnstileField value="tok" onChange={onChange} />);
    await userEvent.click(screen.getByText('expire'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('errorClearsToken', async () => {
    const onChange = vi.fn();
    render(<TurnstileField value="tok" onChange={onChange} />);
    await userEvent.click(screen.getByText('error'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('resetsWidgetWhenValueClearedAfterToken', () => {
    const { rerender } = render(<TurnstileField value="" onChange={vi.fn()} />);
    expect(resetMock).not.toHaveBeenCalled();
    rerender(<TurnstileField value="tok" onChange={vi.fn()} />);
    expect(resetMock).not.toHaveBeenCalled();
    rerender(<TurnstileField value="" onChange={vi.fn()} />);
    expect(resetMock).toHaveBeenCalledTimes(1);
  });
});
