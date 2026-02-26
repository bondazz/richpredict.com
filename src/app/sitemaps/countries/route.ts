import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

export async function GET() {
    const baseUrl = 'https://richpredict.com';

    try {
        const { data: countries } = await supabaseAdmin
            .from('countries')
            .select('*');

        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${(countries || []).map(country => `
    <url>
        <loc>${baseUrl}/predictions/football/${escapeXml((country.slug || country.name || '').toLowerCase().replace(/\s+/g, '-'))}</loc>
        <lastmod>${formatDate(new Date().toISOString())}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`).join('')}
</urlset>`;

        return new NextResponse(sitemapXML, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
            }
        });

    } catch (e) {
        return new NextResponse('Error generating countries sitemap', { status: 500 });
    }
}
