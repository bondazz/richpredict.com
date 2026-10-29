import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateSEOSlug } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams() {
    return [
        { sport: 'football' },
    ];
}

function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ sport: string }> }
) {
    const baseUrl = 'https://richpredict.com';
    const { sport } = await params;

    // Fetch total count first so we can run all chunks in parallel
    let countQuery = supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true });

    if (sport.toLowerCase() === 'football') {
        countQuery = countQuery.or('category.ilike.Football,category.is.null');
    } else {
        countQuery = countQuery.ilike('category', sport);
    }

    const { count } = await countQuery;
    const totalCount = Math.min(count || 10000, 15000);
    const pageSize = 1000;
    const numPages = Math.ceil(totalCount / pageSize);

    const chunkPromises = Array.from({ length: numPages }, (_, page) => {
        let query = supabase
            .from('predictions')
            .select('slug, home_team, away_team, created_at, match_date')
            .order('match_date', { ascending: false })
            .order('id', { ascending: true })
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (sport.toLowerCase() === 'football') {
            query = query.or('category.ilike.Football,category.is.null');
        } else {
            query = query.ilike('category', sport);
        }
        return query;
    });

    const results = await Promise.all(chunkPromises);
    const allPredictions = results.flatMap(r => r.data || []);

    const seenUrls = new Set<string>();
    const urlEntries: string[] = [];

    for (const p of allPredictions) {
        if (!p.home_team || !p.away_team) continue;
        const finalSlug = generateSEOSlug(p.home_team, p.away_team, p.slug);
        if (!finalSlug) continue;

        const loc = `${baseUrl}/predictions/${finalSlug}`;
        if (seenUrls.has(loc)) continue;
        seenUrls.add(loc);

        const lastMod = p.created_at
            ? new Date(p.created_at).toISOString()
            : (p.match_date ? `${p.match_date}T00:00:00.000Z` : '2026-06-02T00:00:00.000Z');

        urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
