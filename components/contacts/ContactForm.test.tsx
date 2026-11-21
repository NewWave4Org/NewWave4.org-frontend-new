import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { store } from '@/store/store';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import ContactForm from './ContactForm';

const { requestPublic, turnstile } = vi.hoisted(() => ({
  requestPublic: vi.fn(),
  turnstile: { enabled: true, values: [] as string[] },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock at the http layer so the real forms api -> service -> thunk chain runs.
vi.mock('@/utils/http/http-request-service', async importOriginal => ({
  ...(await importOriginal<
    typeof import('@/utils/http/http-request-service')
  >()),
  requestPublic,
}));

/** Exactly what the real requestPublic throws for a backend error response. */
const backendError = (errors: string[]) => {
  const err = new AxiosError('Request failed with status code 400');
  err.response = {
    status: 400,
    data: { status: 'BAD_REQUEST', errors },
  } as AxiosError['response'];
  return normalizeApiError(err);
};

const sentBody = () => requestPublic.mock.calls.at(-1)?.[0]?.body;

vi.mock('@/components/shared/antispam/TurnstileField', () => ({
  isTurnstileEnabled: () => turnstile.enabled,
  default: ({
    value,
    onChange,
    onError,
  }: {
    value: string;
    onChange: (t: string) => void;
    onError?: () => void;
  }) => {
    turnstile.values.push(value);
    return (
      <>
        <button type="button" onClick={() => onChange('tok')}>
          Get token
        </button>
        <button
          type="button"
          onClick={() => {
            onChange('');
            onError?.();
          }}
        >
          Widget error
        </button>
      </>
    );
  },
}));

const renderForm = () =>
  render(
    <Provider store={store}>
      <ContactForm />
    </Provider>,
  );

const fill = async () => {
  await userEvent.type(screen.getByLabelText(/forms_label.name/), 'Ivan');
  await userEvent.type(
    screen.getByLabelText(/forms_label.email/),
    'ivan@example.com',
  );
  await userEvent.type(
    screen.getByLabelText(/forms_label.message_text/),
    'Hello there',
  );
};

describe('ContactForm anti-spam', () => {
  beforeEach(() => {
    requestPublic.mockReset();
    turnstile.enabled = true;
    turnstile.values = [];
  });

  it('sends token and empty honeypot', async () => {
    requestPublic.mockResolvedValue({});
    renderForm();
    await fill();
    await userEvent.click(screen.getByText('Get token'));
    await userEvent.click(screen.getByRole('button', { name: 'buttons.send' }));

    await waitFor(() => expect(requestPublic).toHaveBeenCalledTimes(1));
    expect(sentBody()).toEqual(
      expect.objectContaining({
        name: 'Ivan',
        email: 'ivan@example.com',
        description: 'Hello there',
        turnstileToken: 'tok',
        website: '',
      }),
    );
  });

  it('honeypotValueReachesPayload', async () => {
    requestPublic.mockResolvedValue({});
    const { container } = renderForm();
    await fill();
    const honeypot = container.querySelector(
      'input[name="nw_hp"]',
    ) as HTMLInputElement;
    await userEvent.type(honeypot, 'spam.example');
    await userEvent.click(screen.getByText('Get token'));
    await userEvent.click(screen.getByRole('button', { name: 'buttons.send' }));

    await waitFor(() => expect(requestPublic).toHaveBeenCalledTimes(1));
    expect(sentBody()).toEqual(
      expect.objectContaining({ website: 'spam.example' }),
    );
  });

  it('keepsTypedValuesWhenTokenArrives', async () => {
    renderForm();
    const name = screen.getByLabelText(/forms_label.name/);
    await userEvent.type(name, 'Ivan');
    await userEvent.click(screen.getByText('Get token'));

    expect(screen.getByLabelText(/forms_label.name/)).toHaveValue('Ivan');
  });

  it('submitDisabledUntilToken', async () => {
    renderForm();
    const send = screen.getByRole('button', { name: 'buttons.send' });
    expect(send).toBeDisabled();
    await userEvent.click(screen.getByText('Get token'));
    expect(send).toBeEnabled();
  });

  it('submitEnabledWithoutSiteKey', async () => {
    turnstile.enabled = false;
    requestPublic.mockResolvedValue({});
    renderForm();
    await fill();
    const send = screen.getByRole('button', { name: 'buttons.send' });
    expect(send).toBeEnabled();

    await userEvent.click(send);
    await waitFor(() => expect(requestPublic).toHaveBeenCalledTimes(1));
    expect(sentBody()).toEqual(
      expect.objectContaining({ turnstileToken: '', website: '' }),
    );
  });

  it('submitEnabledAfterWidgetError', async () => {
    requestPublic.mockResolvedValue({});
    renderForm();
    await fill();
    const send = screen.getByRole('button', { name: 'buttons.send' });
    expect(send).toBeDisabled();

    await userEvent.click(screen.getByText('Widget error'));
    expect(send).toBeEnabled();

    await userEvent.click(send);
    await waitFor(() => expect(requestPublic).toHaveBeenCalledTimes(1));
    // The backend decides; the client-only flag never reaches the payload.
    expect(sentBody()).toEqual(
      expect.objectContaining({ turnstileToken: '', website: '' }),
    );
    expect(sentBody()).not.toHaveProperty('turnstileError');
  });

  it('clearsTokenAfterFailedSubmit', async () => {
    requestPublic.mockRejectedValue(backendError(['boom']));
    renderForm();
    await fill();
    await userEvent.click(screen.getByText('Get token'));
    await userEvent.click(screen.getByRole('button', { name: 'buttons.send' }));

    await waitFor(() => expect(requestPublic).toHaveBeenCalled());
    await waitFor(() => expect(turnstile.values.at(-1)).toBe(''));
    expect(turnstile.values).toContain('tok');
  });

  it('shows the translated text for a captcha failure', async () => {
    requestPublic.mockRejectedValue(
      backendError(['Captcha verification failed']),
    );
    renderForm();
    await fill();
    await userEvent.click(screen.getByText('Get token'));
    await userEvent.click(screen.getByRole('button', { name: 'buttons.send' }));

    expect(
      await screen.findByText('forms_errors.captcha_failed'),
    ).toBeInTheDocument();
  });
});
