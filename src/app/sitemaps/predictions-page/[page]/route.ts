import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateSEOSlug } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams() {
    return [
        { page: '1' },
        { page: '2' },
        { page: '3' },
        { page: '4' },
        { page: '5' },
    ];
}

const URLS_PER_SITEMAP = 2000;
const SUPABASE_CHUNK_SIZE = 1000;

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
    { params }: { params: Promise<{ page: string }> }
) {
    const baseUrl = 'https://richpredict.com';
    const { page: pageParam } = await params;
    const pageNum = parseInt(pageParam, 10);

    if (isNaN(pageNum) || pageNum < 1 || pageNum > 50) {
        return new NextResponse('Not Found', { status: 404 });
    }

    const startOffset = (pageNum - 1) * URLS_PER_SITEMAP;
    const numChunks = URLS_PER_SITEMAP / SUPABASE_CHUNK_SIZE;

    // Fetch chunks in parallel for fast response (< 300ms)
    const chunkPromises = Array.from({ length: numChunks }, (_, i) => {
        const from = startOffset + i * SUPABASE_CHUNK_SIZE;
        const to = from + SUPABASE_CHUNK_SIZE - 1;
        return supabase
            .from('predictions')
            .select('slug, home_team, away_team, created_at, match_date')
            .order('match_date', { ascending: false })
            .order('id', { ascending: true })
            .range(from, to);
    });

    const chunkResults = await Promise.all(chunkPromises);
    const allPredictions = chunkResults.flatMap(r => r.data || []);

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

