import { NextResponse } from 'next/server';
import { supabase, getCountriesByRegion } from '@/lib/supabase';
import { generateSEOSlug, slugifyCountry } from '@/lib/utils';

export const revalidate = 3600;

function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    const baseUrl = 'https://richpredict.com';

    // Fetch active countries, published news, and latest 3000 predictions in parallel
    const [countries, newsRes, predPage1Res, predPage2Res, predPage3Res] = await Promise.all([
        getCountriesByRegion(true),
        supabase
            .from('blog_posts')
            .select('slug, created_at, updated_at')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(500),
        supabase
            .from('predictions')
            .select('home_team, away_team, slug, created_at')
            .order('created_at', { ascending: false })
            .range(0, 999),
        supabase
            .from('predictions')
            .select('home_team, away_team, slug, created_at')
            .order('created_at', { ascending: false })
            .range(1000, 1999),
        supabase
            .from('predictions')
            .select('home_team, away_team, slug, created_at')
            .order('created_at', { ascending: false })
            .range(2000, 2999),
    ]);

    const predictions = [
        ...(predPage1Res.data || []),
        ...(predPage2Res.data || []),
        ...(predPage3Res.data || []),
    ];

    const latestPredDate = predictions[0]?.created_at
        ? new Date(predictions[0].created_at).toISOString()
        : '2026-06-02T07:36:14.000Z';

    const staticRoutes = [
        { path: '', priority: '1.0', changefreq: 'daily' },
        { path: '/predictions', priority: '0.9', changefreq: 'daily' },
        { path: '/news', priority: '0.9', changefreq: 'daily' },
        { path: '/vip', priority: '0.8', changefreq: 'weekly' },
        { path: '/football', priority: '0.8', changefreq: 'daily' },
        { path: '/tennis', priority: '0.7', changefreq: 'daily' },
        { path: '/basketball', priority: '0.7', changefreq: 'daily' },
        { path: '/hockey', priority: '0.7', changefreq: 'daily' },
        { path: '/golf', priority: '0.6', changefreq: 'weekly' },
        { path: '/baseball', priority: '0.6', changefreq: 'weekly' },
        { path: '/snooker', priority: '0.6', changefreq: 'weekly' },
        { path: '/volleyball', priority: '0.6', changefreq: 'weekly' },
        { path: '/contact', priority: '0.7', changefreq: 'monthly' },
        { path: '/faq', priority: '0.7', changefreq: 'monthly' },
        { path: '/advertise', priority: '0.6', changefreq: 'monthly' },
        { path: '/mobile', priority: '0.6', changefreq: 'monthly' },
        { path: '/recommended', priority: '0.6', changefreq: 'monthly' },
        { path: '/terms', priority: '0.5', changefreq: 'yearly' },
        { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
        { path: '/gdpr', priority: '0.5', changefreq: 'yearly' },
        { path: '/impressum', priority: '0.5', changefreq: 'yearly' },
    ];

    const urlEntries: string[] = [];
    const seenUrls = new Set<string>();

    // 1. Static & Sport Hub Routes
    for (const r of staticRoutes) {
        const loc = `${baseUrl}${r.path}`;
        if (seenUrls.has(loc)) continue;
        seenUrls.add(loc);
        urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${latestPredDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`);
    }

    // 2. Country Hub Routes
    for (const c of countries) {
        const slug = slugifyCountry(c.name || '');
        if (!slug) continue;
        const loc = `${baseUrl}/predictions/football/${slug}`;
        if (seenUrls.has(loc)) continue;
        seenUrls.add(loc);
        urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${latestPredDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);
    }

    // 3. Published News Articles
    for (const post of newsRes.data || []) {
        if (!post.slug) continue;
        const loc = `${baseUrl}/news/${post.slug}`;
        if (seenUrls.has(loc)) continue;
        seenUrls.add(loc);
        const mod = (post.updated_at || post.created_at)
            ? new Date(post.updated_at || post.created_at).toISOString()
            : latestPredDate;
        urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${mod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }

    // 4. Match Prediction Pages
    for (const m of predictions) {
        if (!m.home_team || !m.away_team || !m.slug) continue;
        const seoSlug = generateSEOSlug(m.home_team, m.away_team, m.slug);
        if (!seoSlug) continue;
        const loc = `${baseUrl}/predictions/${seoSlug}`;
        if (seenUrls.has(loc)) continue;
        seenUrls.add(loc);
        const mod = m.created_at ? new Date(m.created_at).toISOString() : latestPredDate;
        urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${mod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
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
