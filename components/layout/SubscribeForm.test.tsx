import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { store } from '@/store/store';
import { normalizeApiError } from '@/utils/http/normalizeApiError';
import SubscribeForm from './SubscribeForm';

const { requestPublic, turnstile } = vi.hoisted(() => ({
  requestPublic: vi.fn(),
  turnstile: { values: [] as string[] },
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

vi.mock('@/components/shared/antispam/TurnstileField', () => ({
  isTurnstileEnabled: () => true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (t: string) => void;
  }) => {
    turnstile.values.push(value);
    return (
      <button type="button" onClick={() => onChange('tok')}>
        Get token
      </button>
    );
  },
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

const submit = async () => {
  await userEvent.type(
    screen.getByLabelText(/forms_label.enter_email/),
    'a@b.com',
  );
  await userEvent.click(screen.getByText('Get token'));
  await userEvent.click(
    screen.getByRole('button', { name: 'buttons.sign_up' }),
  );
};

const renderForm = () =>
  render(
    <Provider store={store}>
      <SubscribeForm />
    </Provider>,
  );

describe('SubscribeForm anti-spam', () => {
  beforeEach(() => {
    requestPublic.mockReset();
    turnstile.values = [];
  });

  it('SubscribeForm sends object body', async () => {
    requestPublic.mockResolvedValue({});
    renderForm();
    await submit();

    await waitFor(() => expect(requestPublic).toHaveBeenCalledTimes(1));
    expect(requestPublic.mock.calls[0][0].body).toEqual({
      email: 'a@b.com',
      turnstileToken: 'tok',
      website: '',
    });
  });

  it('shows the translated text for a captcha failure', async () => {
    requestPublic.mockRejectedValue(
      backendError(['Captcha verification failed']),
    );
    renderForm();
    await submit();

    expect(
      await screen.findByText('forms_errors.captcha_failed'),
    ).toBeInTheDocument();
  });

  it('clearsTokenAfterFailedSubmit', async () => {
    requestPublic.mockRejectedValue(backendError(['Subscribe failed']));
    renderForm();
    await submit();

    await waitFor(() => expect(requestPublic).toHaveBeenCalled());
    expect(await screen.findByText('Subscribe failed')).toBeInTheDocument();
    expect(turnstile.values).toContain('tok');
    expect(turnstile.values.at(-1)).toBe('');
  });
});
