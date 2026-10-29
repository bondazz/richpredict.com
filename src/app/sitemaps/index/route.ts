import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

const URLS_PER_SITEMAP = 2000;

export async function GET() {
    const baseUrl = 'https://richpredict.com';

    // Query total prediction count and latest timestamps in parallel
    const [predCountRes, latestPredRes, latestNewsRes] = await Promise.all([
        supabase.from('predictions').select('*', { count: 'exact', head: true }),
        supabase.from('predictions').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('blog_posts').select('created_at, updated_at').eq('published', true).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);

    const totalPredictions = predCountRes.count || 9448;
    const totalPredPages = Math.max(1, Math.ceil(totalPredictions / URLS_PER_SITEMAP));

    const latestPredDate = latestPredRes.data?.created_at
        ? new Date(latestPredRes.data.created_at).toISOString()
        : '2026-06-02T07:36:14.000Z';

    const latestNewsDate = (latestNewsRes.data?.updated_at || latestNewsRes.data?.created_at)
        ? new Date(latestNewsRes.data.updated_at || latestNewsRes.data.created_at).toISOString()
        : '2026-03-04T20:22:13.000Z';

    const sitemaps: { loc: string; lastmod: string }[] = [
        { loc: `${baseUrl}/sitemap-static.xml`, lastmod: latestPredDate },
        { loc: `${baseUrl}/sitemap-countries.xml`, lastmod: latestPredDate },
        { loc: `${baseUrl}/sitemap-news.xml`, lastmod: latestNewsDate },
    ];

    for (let page = 1; page <= totalPredPages; page++) {
        sitemaps.push({
            loc: `${baseUrl}/sitemap-predictions-${page}.xml`,
            lastmod: latestPredDate,
        });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
