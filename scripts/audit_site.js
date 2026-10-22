const https = require('https');

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
        }).on('error', reject);
    });
}

async function main() {
    console.log('--- AUDITING RICHPREDICT.COM ---');
    const home = await fetch('https://richpredict.com/');
    console.log('Homepage status:', home.status);
    console.log('Homepage headers x-robots-tag:', home.headers['x-robots-tag']);
    
    // Check links on home
    const linkMatches = home.body.match(/href="([^"]+)"/g) || [];
    const hrefs = linkMatches.map(m => m.slice(6, -1));
    const uniqueHrefs = [...new Set(hrefs)];
    console.log('Total unique hrefs on homepage:', uniqueHrefs.length);
    const predHrefs = uniqueHrefs.filter(h => h.includes('/predictions'));
    console.log('Total prediction hrefs on homepage:', predHrefs.length);
    console.log('Sample prediction hrefs:', predHrefs.slice(0, 10));

    // Check footer & header links
    console.log('All unique hrefs:', uniqueHrefs);

    // Check sitemaps
    const sitemapIndex = await fetch('https://richpredict.com/sitemap_index.xml');
    console.log('\nSitemap index status:', sitemapIndex.status);
    console.log('Sitemap index headers:', sitemapIndex.headers['content-type']);

    const staticSitemap = await fetch('https://richpredict.com/sitemap-static.xml');
    console.log('Static sitemap status:', staticSitemap.status);
    const staticUrls = (staticSitemap.body.match(/<loc>([^<]+)<\/loc>/g) || []).map(m => m.replace(/<\/?loc>/g, ''));
    console.log('Static URLs in sitemap:', staticUrls);

    // Test each static URL
    console.log('\nTesting each static URL:');
    for (const u of staticUrls) {
        const res = await fetch(u);
        const canonMatch = res.body.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/i) || res.body.match(/<link[^>]+href="([^"]+)"[^>]*rel="canonical"/i);
        const titleMatch = res.body.match(/<title>([^<]+)<\/title>/i);
        const robotsMatch = res.body.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i);
        console.log(`URL: ${u} | Status: ${res.status} | Title: ${titleMatch ? titleMatch[1] : 'NONE'} | Canonical: ${canonMatch ? canonMatch[1] : 'NONE'} | Robots: ${robotsMatch ? robotsMatch[1] : 'NONE'}`);
    }
}

main().catch(console.error);
