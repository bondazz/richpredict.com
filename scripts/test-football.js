const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    console.log('Navigating to football...');
    const response = await page.goto('https://www.flashscore.com/news/football/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Status code:', response.status());

    await page.waitForTimeout(4000);

    const links = await page.evaluate((limit) => {
        const uniqueLinks = new Set();
        const linksArr = [];
        const selectors = [
            'a[data-testid="wcl-newsArticlePreview"]',
            '.wcl-newsArticlePreview_YpdN4',
            'a[href*="/news/"]'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of Array.from(elements)) {
                if (el.href) {
                    uniqueLinks.add(el.href);
                    linksArr.push(el.href);
                }
            }
        }
        return linksArr;
    }, 15);

    console.log(`Found ${links.length} matching links. Sample:`, links.slice(0, 5));

    await browser.close();
})();
