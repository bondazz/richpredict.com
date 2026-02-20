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

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/match/:path*',
        '/LEAGUE/:path*',
    ],
}
