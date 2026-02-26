import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { chromium, Browser } from 'playwright';
import { generateSEOSlug } from '@/lib/utils';

export const revalidate = 0;

async function rewriteWithDeepSeek(originalTitle: string, originalContent: string, category: string, logs: string[]) {
    if (!process.env.DEEPSEEK_API_KEY) {
        logs.push("⚠️ DeepSeek API Key missing from environment.");
        return null;
    }

    // Determine internal link based on category
    let internalLink = '/';
    let linkLabel = 'sports predictions';

    const cat = category.toLowerCase();
    if (cat === 'football') {
        internalLink = '/';
        linkLabel = 'football predictions';
    } else if (['tennis', 'basketball', 'hockey', 'golf', 'baseball', 'snooker', 'volleyball'].includes(cat)) {
        internalLink = `/${cat}`;
        linkLabel = `${category} news and tips`;
    }

    try {
        const prompt = `
        You are an elite sports journalist and SEO strategist with 20+ years of experience in top-tier publications. 
        Your task is to REWRITE the following sports news article using a "Human Writer" style. 
        It must feel authentic, insightful, and flow naturally, completely avoiding robotic or repetitive AI patterns.

        CRITICAL EDITORIAL GUIDELINES:
        1. HUMAN-CENTRIC WRITING: Write with personality. Use varied sentence structures, professional vocabulary, and smooth transitions. Avoid phrases like "In summary" or "In conclusion".
        2. NO H1 TAGS IN CONTENT: You are strictly forbidden from using <h1> tags in the 'content' field. Use <h2>, <h3>, <h4>, and <h5> for hierarchy.
        3. READABILITY: Focus on a readability score of 100+. The text must be clear, punchy, and engaging for sports fans.
        4. TITLE REQUIREMENTS (STRICT): The main 'title' and 'meta_title' MUST be between 20 and 70 characters long. These should be punchy, high-impact headlines that are perfect for CTR and mobile displays.
        5. INTERNAL SEO LINK: You MUST naturally embed exactly ONE internal link in the body content. 
           The link MUST be: <a href="${internalLink}" rel="dofollow">${linkLabel}</a>
           Integrate it into a relevant sentence where it makes contextual sense.
        6. UNIQUENESS: 100% unique content. Do not paraphrase; reimagine the story while keeping the facts.
        7. STRUCTURE: Include a strong introduction, detailed analysis sections, and a natural wrapping up.
        8. FAQ SECTION (MANDATORY): Append a stylized, high-end FAQ section at the VERY END.
           You MUST use this EXACT HTML structure for EVERY article (No variations):
           <section class="news-faq-section">
             <h2 class="news-faq-title">FAQs</h2>
             <div class="news-faq-container">
               <details class="news-faq-item">
                 <summary class="news-faq-question">Detailed Question 1?</summary>
                 <div class="news-faq-answer">Professional, detailed answer here...</div>
               </details>
               <details class="news-faq-item">
                 <summary class="news-faq-question">Detailed Question 2?</summary>
                 <div class="news-faq-answer">Professional, detailed answer here...</div>
               </details>
               <!-- Add 3 more items for a total of 5 -->
             </div>
           </section>
        9. SEO METADATA: Provide a Meta Description (max 160 chars) that is conversion-optimized.

        ORIGINAL TITLE: ${originalTitle}
        ORIGINAL CONTENT: ${originalContent}

        RETURN ONLY VALID JSON:
        {
          "title": "A punchy human headline between 20-70 characters",
          "content": "HTML_CONTENT_WITH_H2_TO_H5_TAGS_AND_INTERNAL_LINK_AND_FAQ",
          "meta_title": "SEO Meta Title between 20-70 characters",
          "meta_description": "SEO Meta Description",
          "excerpt": "Compelling 2-sentence summary"
        }`;

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional human sports writer. You provide authentic, high-value content with perfect SEO structure in JSON format."
                    },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        if (!data.choices || data.choices.length === 0) {
            throw new Error("DeepSeek returned empty response");
        }

        const result = JSON.parse(data.choices[0].message.content);
        return result;
    } catch (err: any) {
        logs.push(`❌ DeepSeek Error: ${err.message}`);
        return null;
    }
}

export async function POST(req: Request) {
    let browser: Browser | null = null;
    try {
        const { category, articleCount, targetLink } = await req.json();
        const logs: string[] = [];

        let targetUrl = targetLink;
        if (!targetUrl) {
            const newsCategory = category.toLowerCase();
            targetUrl = `https://www.flashscore.com/news/${newsCategory}/`;
        }

        logs.push(`🚀 Starting News_Bot synchronization...`);
        logs.push(`Target URL: ${targetUrl}`);

        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            viewport: { width: 1440, height: 1200 }
        });

        const page = await context.newPage();

        // Navigate with a slightly lower timeout and more reliable wait state
        try {
            await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
            // Add a small manual wait for any dynamic content
            await page.waitForTimeout(3000);
        } catch (e: any) {
            logs.push(`⚠️ Initial navigation warning (Retrying...): ${e.message}`);
            // Retry once on timeout
            try {
                await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
                await page.waitForTimeout(3000);
            } catch (e2: any) {
                logs.push(`❌ Second navigation failed: ${e2.message}`);
            }
        }

        // Accept cookies if present
        try {
            const cookieBtn = await page.waitForSelector('#onetrust-accept-btn-handler', { timeout: 3000 });
            if (cookieBtn) await cookieBtn.click();
        } catch (e) { }

        // Efficiently extract article links and images from .fsNews
        logs.push("Scanning main article feed...");
        const articlesToProcess = await page.evaluate((limit) => {
            const container = document.querySelector('.fsNews') || document.querySelector('div[class^="fp-section_"]') || document.body;
            const results = [];
            const uniqueLinks = new Set<string>();

            const elements = container.querySelectorAll('a[href*="/news/"]');
            for (const el of Array.from(elements)) {
                const href = (el as HTMLAnchorElement).href;
                // Exclude parent category or pagination links
                if (href && href.includes('/news/') && !href.match(/\/news\/[a-z\-]+\/?$/) && !href.includes('page-')) {
                    if (!uniqueLinks.has(href)) {
                        let imageUrl = '';

                        // Extract specific avif format from listing
                        const avifSource = el.querySelector('source[type="image/avif"]');
                        if (avifSource) {
                            const srcset = avifSource.getAttribute('srcset') || '';
                            const match = srcset.split(',').map(p => p.trim().split(' ')[0]).find(u => u.includes('r900xfq60'));
                            if (match) imageUrl = match;
                        }

                        // Fallback image extraction from listing
                        if (!imageUrl) {
                            const img = el.querySelector('img');
                            if (img) imageUrl = img.src || img.getAttribute('src') || '';
                        }

                        uniqueLinks.add(href);
                        results.push({ url: href, image: imageUrl });
                    }
                }
                if (results.length >= limit) break;
            }
            return results;
        }, articleCount);

        if (articlesToProcess.length === 0) {
            logs.push("⚠️ No articles found in the expected containers (.fsNews or .fp-section_).");
        }

        logs.push(`Found ${articlesToProcess.length} articles to process.`);
        await page.close(); // Close the index page to free resources

        let successCount = 0;

        // Reuse the same page object for all articles to save memory/CPU
        const scraperPage = await context.newPage();

        for (const item of articlesToProcess) {
            const link = item.url;
            const listingImage = item.image;
            logs.push(`-------------------------------------------`);
            logs.push(`Processing: ${link}`);

            try {
                // Navigate to article page - use lower timeout and faster wait
                await scraperPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await scraperPage.waitForTimeout(1000);

                // Extract original data
                const rawData = await scraperPage.evaluate(() => {
                    const title = document.querySelector('h1[data-testid*="news-heading"], h1.wcl-news-heading')?.textContent || '';
                    const perex = document.querySelector('p[data-testid="wcl-news-perex"]')?.textContent || '';
                    const bodyParts = Array.from(document.querySelectorAll('div[data-testid="fp-newsArticle-body"] p'))
                        .map(p => p.textContent)
                        .filter(txt => txt && txt.length > 20);

                    const body = bodyParts.join('\n\n');
                    return { title, content: `${perex}\n\n${body}`, imageUrl: '' };
                });

                // Prefer the image we grabbed from the listing
                rawData.imageUrl = listingImage;

                if (!rawData.title || rawData.content.length < 100) {
                    logs.push(`⚠️ Skipping: Could not extract enough content.`);
                    continue;
                }

                // Check for duplicate by comparing ORIGINAL Flashscore URL
                const { data: existing } = await supabaseAdmin
                    .from('blog_posts')
                    .select('id')
                    .eq('canonical_url', link)
                    .single();

                if (existing) {
                    logs.push(`⏩ Already Published: Skipping this article.`);
                    continue;
                }

                logs.push(`Original Title: ${rawData.title.substring(0, 50)}...`);
                logs.push(`Calling DeepSeek AI for rewriting...`);

                const aiResult = await rewriteWithDeepSeek(rawData.title, rawData.content, category, logs);

                if (aiResult) {
                    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const finalSlug = slugify(aiResult.title);

                    logs.push(`📸 Image Selected: ${rawData.imageUrl}`);

                    const { error: insertError } = await supabaseAdmin.from('blog_posts').insert([{
                        title: aiResult.title,
                        slug: finalSlug,
                        content: aiResult.content,
                        excerpt: aiResult.excerpt || rawData.title,
                        image_url: rawData.imageUrl,
                        og_image_url: rawData.imageUrl,
                        category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
                        meta_title: aiResult.meta_title,
                        meta_description: aiResult.meta_description,
                        canonical_url: link,
                        language: 'en',
                        published: true,
                        is_indexable: true,
                        created_at: new Date().toISOString()
                    }]);

                    if (insertError) {
                        logs.push(`❌ Database Error: ${insertError.message}`);
                    } else {
                        logs.push(`✅ Published: ${aiResult.title}`);
                        successCount++;
                    }
                }

            } catch (err: any) {
                logs.push(`❌ Error processing article: ${err.message}`);
            }
        }

        await scraperPage.close();
        await browser.close();
        return NextResponse.json({ success: true, count: successCount, logs });

    } catch (error: any) {
        if (browser) await browser.close();
        return NextResponse.json({ success: false, error: error.message, logs: [`CRITICAL: ${error.message}`] });
    }
}
