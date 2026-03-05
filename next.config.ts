import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            { source: '/sitemap_index.xml', destination: '/sitemaps/index' },
            { source: '/sitemap-static.xml', destination: '/sitemaps/static' },
            { source: '/sitemap-countries.xml', destination: '/sitemaps/countries' },
            { source: '/sitemap-news.xml', destination: '/sitemaps/news' },
            { source: '/sitemap-predictions-:sport.xml', destination: '/sitemaps/predictions/:sport' },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.cdnfonts.com; img-src 'self' data: https: https://www.google-analytics.com; font-src 'self' https://fonts.cdnfonts.com; connect-src 'self' https://xacflkmlqvifsxwysofm.supabase.co https://vitals.vercel-insights.com https://www.google-analytics.com; frame-ancestors 'none';",
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'static.flashscore.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
        ],
    },
};

export default nextConfig;
