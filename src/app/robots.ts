import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://richpredict.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/'],
        },
        sitemap: [
            `${baseUrl}/sitemap_index.xml`,
            `${baseUrl}/sitemap-static.xml`,
            `${baseUrl}/sitemap-countries.xml`,
            `${baseUrl}/sitemap-news.xml`,
            `${baseUrl}/sitemap-predictions-football.xml`
        ],
    }
}
