import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['de', 'es', 'fr', 'it', 'tr', 'pt', 'ru', 'ar', 'zh', 'ja', 'id', 'hi', 'ko', 'vi', 'az', 'nl', 'pl', 'th', 'sv', 'el', 'cs', 'hu', 'ro', 'da', 'fi', 'no', 'sk', 'bg', 'hr'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Bypass sitemaps and robots.txt completely so edge caching works cleanly
    if (pathname.startsWith('/sitemap') || pathname === '/robots.txt') {
        return NextResponse.next();
    }

    // Check if the path starts with any supported locale (e.g., /de/predictions/...)
    const pathnameParts = pathname.split('/');
    const firstPart = pathnameParts[1];

    if (SUPPORTED_LOCALES.includes(firstPart)) {
        // Redirect to the root version (English) with a 301 Permanent Redirect
        const newPathname = '/' + pathnameParts.slice(2).join('/');
        const url = request.nextUrl.clone();
        url.pathname = newPathname === '//' ? '/' : newPathname;
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip internal paths, static assets, sitemaps, and robots.txt
        '/((?!api|_next/static|_next/image|favicon.ico|robots\\.txt|sitemap.*\\.xml|sitemaps|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml)$).*)',
    ],
};
