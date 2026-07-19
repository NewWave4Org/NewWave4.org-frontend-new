import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const intlMiddleware = vi.fn(() => 'intl-response');

vi.mock('next-intl/middleware', () => ({
  default: vi.fn(() => intlMiddleware),
}));

// i18n/index.ts re-exports i18n/config/navigation.ts, which pulls in
// next-intl/navigation -> next/navigation (client-only) at module load time.
// Middleware only needs `routing`, so stub navigation to avoid that resolution.
vi.mock('next-intl/navigation', () => ({
  createNavigation: vi.fn(() => ({
    Link: vi.fn(),
    redirect: vi.fn(),
    usePathname: vi.fn(),
    useRouter: vi.fn(),
    getPathname: vi.fn(),
  })),
}));

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(['/admin', '/admin/articles', '/donation', '/donation/checkout', '/subscribe', '/unsubscribe'])(
    'bypasses next-intl for %s',
    async (pathname) => {
      const { middleware } = await import('./middleware');
      const request = new NextRequest(new URL(pathname, 'http://localhost:3000'));

      const result = middleware(request);

      expect(result).toBeUndefined();
      expect(intlMiddleware).not.toHaveBeenCalled();
    }
  );

  it.each(['/', '/news', '/ua/news', '/en/about'])(
    'delegates to next-intl middleware for %s',
    async (pathname) => {
      const { middleware } = await import('./middleware');
      const request = new NextRequest(new URL(pathname, 'http://localhost:3000'));

      const result = middleware(request);

      expect(intlMiddleware).toHaveBeenCalledWith(request);
      expect(result).toBe('intl-response');
    }
  );
});
