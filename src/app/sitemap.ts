import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://richpredict.com'

    // Static routes
    const routes = [
        '',
        '/predictions',
        '/news',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [
        ...routes,
    ]
}
