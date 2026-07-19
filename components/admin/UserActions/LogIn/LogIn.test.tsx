import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import * as yup from 'yup';
import { afterEach, describe, expect, it, vi } from 'vitest';
import rootReducer from '@/store/rootReducer';
import LogIn from './LogIn';

const { replaceMock, loginAuthMock, getUserInfoMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  loginAuthMock: vi.fn(),
  getUserInfoMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock('@/utils/auth', () => ({
  authService: { loginAuth: loginAuthMock, getUserInfo: getUserInfoMock },
}));

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

function renderLogIn() {
  const store = configureStore({ reducer: rootReducer });
  return render(
    <Provider store={store}>
      <LogIn validationSchema={validationSchema} />
    </Provider>
  );
}

describe('LogIn', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('logs in and redirects to the role-based path on success', async () => {
    loginAuthMock.mockResolvedValueOnce({ accessToken: 'token' });
    getUserInfoMock.mockResolvedValueOnce({ id: 1, email: 'admin@newwave4.org', roles: ['ROLE_ADMIN'] });

    renderLogIn();

    await userEvent.type(screen.getByLabelText(/email address/i), 'admin@newwave4.org');
    await userEvent.type(screen.getByLabelText(/^password/i), 'super-secret');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/admin/users'));

    expect(loginAuthMock).toHaveBeenCalledWith({
      email: 'admin@newwave4.org',
      password: 'super-secret',
    });
  });
});
