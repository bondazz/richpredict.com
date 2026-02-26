import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
        const { data: news } = await supabaseAdmin
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    ${(news || []).map(post => {
            const date = formatDate(post.created_at);
            return `
    <url>
        <loc>${baseUrl}/news/${escapeXml(post.slug)}</loc>
        <lastmod>${date}</lastmod>
        ${post.image_url ? `
        <image:image>
            <image:loc>${escapeXml(post.image_url)}</image:loc>
        </image:image>` : ''}
        <news:news>
            <news:publication>
                <news:name>RichPredict</news:name>
                <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${date}</news:publication_date>
            <news:title>${escapeXml(post.title)}</news:title>
            <news:keywords>${escapeXml(post.category || 'Sports')}</news:keywords>
        </news:news>
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
        return new NextResponse('Error generating news sitemap', { status: 500 });
    }
}
