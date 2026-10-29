import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

function escapeXml(unsafe: string): string {
    return (unsafe || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    const baseUrl = 'https://richpredict.com';

    const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, title, created_at, updated_at, image_url, og_image_url, language')
        .eq('published', true)
        .eq('is_indexable', true)
        .order('created_at', { ascending: false });

    const nowMs = Date.now();
    const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

    // Check if any post is within 48 hours for Google News namespace
    const hasRecentNews = (posts || []).some(p => {
        const pubTime = new Date(p.created_at).getTime();
        return (nowMs - pubTime) <= FORTY_EIGHT_HOURS_MS;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"${hasRecentNews ? '\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"' : ''}>
${(posts || []).map(p => {
        const pubDate = new Date(p.created_at);
        const lastMod = p.updated_at ? new Date(p.updated_at).toISOString() : pubDate.toISOString();
        const isRecent = (nowMs - pubDate.getTime()) <= FORTY_EIGHT_HOURS_MS;
        const imageUrl = p.image_url || p.og_image_url;
        const escapedTitle = escapeXml(p.title);

        let imageBlock = '';
        if (imageUrl && imageUrl.startsWith('http')) {
            imageBlock = `\n    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapedTitle}</image:title>
    </image:image>`;
        }

        let newsBlock = '';
        if (isRecent) {
            newsBlock = `\n    <news:news>
      <news:publication>
        <news:name>RichPredict</news:name>
        <news:language>${escapeXml(p.language || 'en')}</news:language>
      </news:publication>
      <news:publication_date>${pubDate.toISOString()}</news:publication_date>
      <news:title>${escapedTitle}</news:title>
    </news:news>`;
        }

        return `  <url>
    <loc>${baseUrl}/news/${escapeXml(p.slug)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageBlock}${newsBlock}
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
