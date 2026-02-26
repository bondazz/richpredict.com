import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSEOSlug } from '@/lib/utils';

function escapeXml(unsafe: string) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return '';
        }
    });
}

function formatDate(date: string) {
    return new Date(date).toISOString().split('.')[0] + '+00:00';
}

export async function GET(req: Request, props: { params: Promise<{ sport: string }> }) {
    const params = await props.params;
    const baseUrl = 'https://richpredict.com';
    const sport = params.sport.toLowerCase();

    try {
        let query = supabaseAdmin
            .from('predictions')
            .select('home_team, away_team, slug, updated_at, category')
            .order('updated_at', { ascending: false })
            .limit(10000); // Max allowed for one sitemap

        // If sport is football, handle empty category too, otherwise exact match
        if (sport === 'football') {
            query = query.or('category.ilike.football,category.is.null');
        } else {
            query = query.ilike('category', sport);
        }

        const { data: matches } = await query;

        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${(matches || []).map(match => {
            const date = formatDate(match.updated_at || new Date().toISOString());
            const finalSlug = generateSEOSlug(match.home_team, match.away_team, match.slug || '');
            return `
    <url>
        <loc>${baseUrl}/predictions/${escapeXml(finalSlug)}</loc>
        <lastmod>${date}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`;
        }).join('')}
</urlset>`;

        return new NextResponse(sitemapXML, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            }
        });

    } catch (e) {
        return new NextResponse(`Error generating ${sport} predictions sitemap`, { status: 500 });
    }
}
