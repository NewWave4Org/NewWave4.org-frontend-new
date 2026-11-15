import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import rootReducer from '@/store/rootReducer';
import { getUserInfo } from '@/store/auth/action';
import AdminHeader from './AdminHeader';

const { pushMock, logOutAuthMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  logOutAuthMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/utils/auth', () => ({
  authService: { logOutAuth: logOutAuthMock },
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

function renderLoggedIn() {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(
    getUserInfo.fulfilled(
      {
        email: 'admin@newwave4.org',
        isActive: true,
        name: 'System Super Admin',
        referenceId: 'ref-1',
        roles: ['ROLE_SUPER_ADMIN'],
        createdAt: null,
        verificatedUser: true,
      },
      'req-1',
    ),
  );
  render(
    <Provider store={store}>
      <AdminHeader />
    </Provider>,
  );
  return store;
}

describe('AdminHeader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows the user name and a visible Log out button without opening a menu', () => {
    renderLoggedIn();

    expect(screen.getByText('System Super Admin')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeVisible();
  });

  it('logs out and returns to the login page when Log out is clicked', async () => {
    logOutAuthMock.mockResolvedValueOnce(undefined);
    const store = renderLoggedIn();

    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/admin'));
    expect(logOutAuthMock).toHaveBeenCalledTimes(1);
    expect(store.getState().authUser.isAuthenticated).toBe(false);
  });

  it('shows no Log out button when nobody is logged in', () => {
    render(
      <Provider store={configureStore({ reducer: rootReducer })}>
        <AdminHeader />
      </Provider>,
    );

    expect(
      screen.queryByRole('button', { name: /log out/i }),
    ).not.toBeInTheDocument();
  });
});
