const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: true });
    // Add realistic user agent and extra HTTP headers if necessary
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    console.log('Navigating...');
    const response = await page.goto('https://www.flashscore.com/news/soccer/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Status code:', response.status());

    await page.waitForTimeout(4000);

    const html = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('flashscore_dump.html', html);

    console.log(`Saved HTML. Length: ${html.length}`);

    await browser.close();
})();
