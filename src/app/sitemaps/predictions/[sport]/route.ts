import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSEOSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
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

    if (!sport) return new NextResponse('Sport required', { status: 400 });

    const baseUrl = 'https://richpredict.com';

    try {
        const { data: matches, error } = await supabaseAdmin
            .from('predictions')
            .select('home_team, away_team, slug, created_at, category')
            .order('created_at', { ascending: false })
            .limit(10000); // Safe limit for performance

        if (error) throw error;

        const filteredMatches = (matches || []).filter(m => {
            const cat = m.category?.toLowerCase() || 'football';
            return sport === 'football' ? (cat === 'football' || cat === '') : (cat === sport);
        });

        const urlEntries = filteredMatches.map(match => {
            const date = formatDate(match.created_at || new Date().toISOString());
            const finalSlug = generateSEOSlug(match.home_team, match.away_team, match.slug || '');
            return `  <url>
    <loc>${baseUrl}/predictions/${escapeXml(finalSlug)}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
        }).join('\n');

        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`.trim();

        return new NextResponse(sitemapXML, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            }
        });

    } catch (e) {
        console.error('Predictions Sitemap Error:', e);
        return new NextResponse(`Error`, { status: 500 });
    }
}
