import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400;

export async function GET() {
    const baseUrl = 'https://richpredict.com';

    const { data: latestPred } = await supabase
        .from('predictions')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const lastMod = latestPred?.created_at
        ? new Date(latestPred.created_at).toISOString()
        : '2026-06-02T07:36:14.000Z';

    const routes = [
        { path: '', priority: '1.0', changefreq: 'daily' },
        { path: '/predictions', priority: '0.9', changefreq: 'daily' },
        { path: '/news', priority: '0.9', changefreq: 'daily' },
        { path: '/vip', priority: '0.8', changefreq: 'weekly' },
        { path: '/football', priority: '0.8', changefreq: 'daily' },
        { path: '/tennis', priority: '0.7', changefreq: 'daily' },
        { path: '/basketball', priority: '0.7', changefreq: 'daily' },
        { path: '/hockey', priority: '0.7', changefreq: 'daily' },
        { path: '/golf', priority: '0.6', changefreq: 'weekly' },
        { path: '/snooker', priority: '0.6', changefreq: 'weekly' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        },
    });
}
