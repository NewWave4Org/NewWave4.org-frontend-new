import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { store } from '@/store/store';
import SubscribeForm from './SubscribeForm';

const { createSubscribe } = vi.hoisted(() => ({ createSubscribe: vi.fn() }));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/utils/forms', () => ({
  formsServices: { createSubscribe },
}));

vi.mock('@/components/shared/antispam/TurnstileField', () => ({
  isTurnstileEnabled: () => true,
  default: ({ onChange }: { onChange: (t: string) => void }) => (
    <button type="button" onClick={() => onChange('tok')}>
      Get token
    </button>
  ),
}));

const renderForm = () =>
  render(
    <Provider store={store}>
      <SubscribeForm />
    </Provider>,
  );

describe('SubscribeForm anti-spam', () => {
  beforeEach(() => {
    createSubscribe.mockReset();
  });

  it('SubscribeForm sends object body', async () => {
    createSubscribe.mockResolvedValue({});
    renderForm();
    await userEvent.type(
      screen.getByLabelText(/forms_label.enter_email/),
      'a@b.com',
    );
    await userEvent.click(screen.getByText('Get token'));
    await userEvent.click(
      screen.getByRole('button', { name: 'buttons.sign_up' }),
    );

    await waitFor(() => expect(createSubscribe).toHaveBeenCalledTimes(1));
    expect(createSubscribe).toHaveBeenCalledWith({
      email: 'a@b.com',
      turnstileToken: 'tok',
      website: '',
    });
  });

  it('shows the translated text for a captcha failure', async () => {
    const err = new AxiosError('bad');
    err.response = {
      data: { status: '400', errors: ['Captcha verification failed'] },
    } as AxiosError['response'];
    createSubscribe.mockImplementation(() => Promise.reject(err));
    renderForm();
    await userEvent.type(
      screen.getByLabelText(/forms_label.enter_email/),
      'a@b.com',
    );
    await userEvent.click(screen.getByText('Get token'));
    await userEvent.click(
      screen.getByRole('button', { name: 'buttons.sign_up' }),
    );

    expect(
      await screen.findByText('forms_errors.captcha_failed'),
    ).toBeInTheDocument();
  });
});
