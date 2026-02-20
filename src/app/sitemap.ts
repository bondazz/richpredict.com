import { MetadataRoute } from 'next'
import { getPredictions } from '@/lib/supabase'
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
    const predictions = await getPredictions(100)
    const predictionRoutes = predictions.map((match) => ({
        url: `${baseUrl}/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`,
        lastModified: new Date(match.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...routes, ...predictionRoutes]
}
