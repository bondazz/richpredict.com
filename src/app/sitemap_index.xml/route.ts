import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper function to format XML dates (ISO 8601 without ms)
const formatDate = (date: Date) => {
    return date.toISOString().split('.')[0] + '+00:00';
};

export async function GET() {
    const baseUrl = 'https://richpredict.com';

    // Default last modified for static endpoints
    const now = formatDate(new Date());

    try {
        // Here we define our sub-sitemaps
        const sitemaps = [
            `${baseUrl}/sitemap-static.xml`,
            `${baseUrl}/sitemap-countries.xml`,
            `${baseUrl}/sitemap-leagues.xml`,
            `${baseUrl}/sitemap-news.xml`
        ];

        // Fetch unique sports/categories to dynamic create sitemap-predictions-[sport].xml
        const { data: categories } = await supabaseAdmin
            .from('predictions')
            .select('category')
            .not('category', 'is', null);

        // Extract unique valid ones
        const uniqueSports = Array.from(new Set(
            (categories || [])
                .map(c => c.category?.toLowerCase() || '')
                .filter(c => c.length > 0)
        ));

        // Let's ensure 'football', 'tennis', 'basketball' exist even if no data natively
        const allSports = Array.from(new Set(['football', 'tennis', 'basketball', ...uniqueSports]));

        // Append to sitemap index
        allSports.forEach(sport => {
            sitemaps.push(`${baseUrl}/sitemap-predictions-${sport}.xml`);
        });

        // Generate the XML for the Sitemap Index
        const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps.map(url => `
    <sitemap>
        <loc>${url}</loc>
        <lastmod>${now}</lastmod>
    </sitemap>`).join('')}
</sitemapindex>`;

        return new NextResponse(sitemapIndexXML, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            }
        });

    } catch (e) {
        return new NextResponse('Error generating sitemap index', { status: 500 });
    }
}
