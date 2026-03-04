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
            `${baseUrl}/sitemap-static.xml`,
            `${baseUrl}/sitemap-countries.xml`,
            `${baseUrl}/sitemap-news.xml`,
            `${baseUrl}/sitemap-predictions-football.xml`,
            `${baseUrl}/sitemap-predictions-tennis.xml`,
            `${baseUrl}/sitemap-predictions-basketball.xml`,
        ],
    }
}
