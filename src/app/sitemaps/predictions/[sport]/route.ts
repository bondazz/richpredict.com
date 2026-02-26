import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSEOSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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

export async function GET(req: Request, context: { params: Promise<{ sport: string }> }) {
    const params = await context.params;
    const sport = params?.sport?.toLowerCase();

    if (!sport) {
        return new NextResponse('Sport parameter is required', { status: 400 });
    }

    const baseUrl = 'https://richpredict.com';

    try {
        // Fetch matches. We use a simpler query to ensures results.
        const { data: matches, error } = await supabaseAdmin
            .from('predictions')
            .select('home_team, away_team, slug, created_at, category')
            .order('created_at', { ascending: false })
            .limit(10000);

        if (error) {
            console.error('Sitemap Error:', error);
            return new NextResponse('Error fetching data', { status: 500 });
        }

        const filteredMatches = (matches || []).filter(m => {
            const cat = m.category?.toLowerCase() || '';
            if (sport === 'football') {
                return cat === 'football' || cat === '';
            }
            return cat === sport;
        });

        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${(filteredMatches || []).map(match => {
            const date = formatDate(match.created_at || new Date().toISOString());
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
