import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import rootReducer from '@/store/rootReducer';
import AuthGate from './AuthGate';

const { replaceMock, getUserInfoMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  getUserInfoMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock('@/utils/auth', () => ({
  authService: { getUserInfo: getUserInfoMock },
}));

function renderWithStore() {
  const store = configureStore({ reducer: rootReducer });
  return render(
    <Provider store={store}>
      <AuthGate>
        <div>protected content</div>
      </AuthGate>
    </Provider>
  );
}

describe('AuthGate', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children once getUserInfo resolves', async () => {
    getUserInfoMock.mockResolvedValueOnce({ id: 1, email: 'admin@newwave4.org' });

    renderWithStore();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('protected content')).toBeInTheDocument());

    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('redirects to /admin and never renders children when getUserInfo is rejected', async () => {
    getUserInfoMock.mockRejectedValueOnce(new Error('unauthenticated'));

    renderWithStore();

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/admin'));

    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
