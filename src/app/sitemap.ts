import { MetadataRoute } from 'next'
import { getPredictions, supabase } from '@/lib/supabase'
import { generateSEOSlug } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://richpredict.com'

    // Base routes
    const routes = [
        '',
        '/predictions',
        '/news',
        '/football',
        '/tennis',
        '/basketball',
        '/hockey',
        '/golf',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic prediction routes
    const [predictions, news] = await Promise.all([
        getPredictions(100),
        supabase.from('blog_posts').select('slug, created_at').eq('published', true)
    ]);

    const predictionRoutes = predictions.map((match) => ({
        url: `${baseUrl}/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`,
        lastModified: new Date(match.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    const newsRoutes = (news.data || []).map((post) => ({
        url: `${baseUrl}/news/${post.slug}`,
        lastModified: new Date(post.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    return [...routes, ...predictionRoutes, ...newsRoutes]
}
