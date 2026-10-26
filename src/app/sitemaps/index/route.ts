import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const formatDate = (date: Date) => date.toISOString().split('.')[0] + '+00:00';

export async function GET() {
    const baseUrl = 'https://richpredict.com';
    const lastMod = formatDate(new Date());

    try {
        // Only include active sitemaps that contain valid URLs. Empty sitemaps cause GSC processing errors.
        const sitemaps = [
            'sitemap-static.xml',
            'sitemap-countries.xml',
            'sitemap-news.xml',
            'sitemap-predictions-football.xml'
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>
    <loc>${baseUrl}/${s}</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`.trim();

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    } catch (e) {
        return new NextResponse('Error', { status: 500 });
    }
}
