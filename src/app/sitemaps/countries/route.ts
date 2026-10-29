import { NextResponse } from 'next/server';
import { getCountriesByRegion, supabase } from '@/lib/supabase';
import { slugifyCountry } from '@/lib/utils';

export const revalidate = 3600;

export async function GET() {
    const baseUrl = 'https://richpredict.com';

    const [countries, latestPredRes] = await Promise.all([
        getCountriesByRegion(true),
        supabase.from('predictions').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle()
    ]);

    const lastMod = latestPredRes.data?.created_at
        ? new Date(latestPredRes.data.created_at).toISOString()
        : '2026-06-02T07:36:14.000Z';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(countries || []).map(c => {
        const slug = slugifyCountry(c.name);
        return `  <url>
    <loc>${baseUrl}/predictions/football/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
