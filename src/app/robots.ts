import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/private/'],
            },
        ],
        sitemap: [
            'https://richpredict.com/sitemap.xml',
            'https://richpredict.com/sitemap-static.xml',
            'https://richpredict.com/sitemap-countries.xml',
            'https://richpredict.com/sitemap-news.xml',
            'https://richpredict.com/sitemap-predictions-1.xml',
            'https://richpredict.com/sitemap-predictions-2.xml',
            'https://richpredict.com/sitemap-predictions-3.xml',
            'https://richpredict.com/sitemap-predictions-4.xml',
            'https://richpredict.com/sitemap-predictions-5.xml',
        ],
    };
}
