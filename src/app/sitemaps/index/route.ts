import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const formatDate = (date: Date) => date.toISOString().split('.')[0] + '+00:00';

export async function GET() {
    const baseUrl = 'https://richpredict.com';
    const now = formatDate(new Date());

    try {
        // Use .xml extensions to make Google bot's life easier
        const sitemaps = [
            `${baseUrl}/sitemap-static.xml`,
            `${baseUrl}/sitemap-countries.xml`,
            `${baseUrl}/sitemap-news.xml`
        ];

        // Optimized: Fetch only a small sample of categories to identify active sports
        const { data: categories } = await supabaseAdmin
            .from('predictions')
            .select('category')
            .not('category', 'is', null)
            .limit(1000);

        const uniqueSports = Array.from(new Set(
            (categories || [])
                .map(c => c.category?.toLowerCase() || '')
                .filter(c => c.length > 0)
        ));

        // Ensure primary sports are always present
        const defaultSports = ['football', 'tennis', 'basketball'];
        const allSports = Array.from(new Set([...defaultSports, ...uniqueSports]));

        allSports.forEach(sport => {
            sitemaps.push(`${baseUrl}/sitemap-predictions-${sport}.xml`);
        });

        const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`.trim();

        return new NextResponse(sitemapIndexXML, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            }
        });

    } catch (e) {
        console.error('Sitemap Index Error:', e);
        return new NextResponse('Error generating sitemap index', { status: 500 });
    }
}
