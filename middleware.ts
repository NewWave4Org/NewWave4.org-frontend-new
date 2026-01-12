import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    if(pathname === '/donation' || pathname.startsWith('/donation/') || pathname === '/admin' || pathname.startsWith('/admin/') ) {
        return
    }

    return intlMiddleware(request)
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
}