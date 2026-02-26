import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = 'https://richpredict.com';
    const now = new Date().toISOString().split('.')[0] + '+00:00';

    const routes = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/predictions', priority: '0.9', changefreq: 'daily' },
        { url: '/news', priority: '0.9', changefreq: 'daily' },
        { url: '/football', priority: '0.8', changefreq: 'daily' },
        { url: '/tennis', priority: '0.8', changefreq: 'daily' },
        { url: '/basketball', priority: '0.8', changefreq: 'daily' },
        { url: '/hockey', priority: '0.8', changefreq: 'daily' },
        { url: '/golf', priority: '0.8', changefreq: 'daily' },
        { url: '/admin/login', priority: '0.1', changefreq: 'yearly' },
    ];

    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes.map(r => `
    <url>
        <loc>${baseUrl}${r.url}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>${r.changefreq}</changefreq>
        <priority>${r.priority}</priority>
    </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemapXML, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
        }
    });
}
