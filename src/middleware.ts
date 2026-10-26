import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Redirect old match links or common typos to the new prediction structure
    if (pathname.startsWith('/match/')) {
        const slug = pathname.split('/').pop()
        return NextResponse.redirect(new URL(`/predictions/${slug}`, request.url), 301)
    }

    // Handle case sensitivity for leagues
    if (pathname.startsWith('/LEAGUE/')) {
        const lowerPath = pathname.toLowerCase()
        return NextResponse.redirect(new URL(lowerPath, request.url), 301)
    }

    const response = NextResponse.next()

    // Inject HTTP Canonical Header for HTML/page routes so Googlebot identifies canonical instantly in HTTP headers
    const isAsset = pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/sitemaps') ||
        pathname.startsWith('/admin') ||
        pathname.includes('.')

    if (!isAsset) {
        const cleanPath = pathname === '/' ? '' : pathname
        const canonicalUrl = `https://richpredict.com${cleanPath}`
        response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - icon.svg (icon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
    ],
}
