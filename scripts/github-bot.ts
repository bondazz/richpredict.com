import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function generateSEOSlug(home: string, away: string, originalSlug: string) {
    const clean = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const parts = originalSlug.split('-');
    let suffix = parts.pop();
    if (parts.length >= 2 && parts[parts.length - 1].length === 2 && parts[parts.length - 2].startsWith('20')) {
        const month = parts.pop();
        const year = parts.pop();
        suffix = `${year}-${month}-${suffix}`;
    }
    return `${clean(home)}-vs-${clean(away)}-predictions-betting-tips-match-previews-${suffix}`;
}

async function getDeepSeekAnalysis(matchData: any, logs: string[]) {
    if (!process.env.DEEPSEEK_API_KEY) {
        logs.push("⚠️ DeepSeek API Key missing.");
        return null;
    }

    try {
        const allowedMarkets = [
            '1.5 Goals Over', '1.5 Goals Under', '2.5 Goals Over', '2.5 Goals Under', '3.5 Goals Over',
            'Double Chance (1X)', 'Double Chance (X2)', 'Double Chance (12)', 'Home Win', 'Away Win', 'Draw',
            'Super Single', 'Both Teams to Score (Yes)', 'Both Teams to Score (No)', 'Draw No Bet (1)', 'Draw No Bet (2)',
            'Win Either Half', 'Over 0.5 First Half', 'Under 1.5 First Half', 'Home Clean Sheet (Yes)', 'Home Clean Sheet (No)',
            'Away Clean Sheet (Yes)', 'Away Clean Sheet (No)', 'Highest Scoring Half', 'Multi Goals (2-4 Goals)',
            'Handicap (+1.5)', 'Handicap (+2.5)', 'Home to Score', 'Away to Score'
        ];

        const prompt = `
        You are a premier football analyst. Generate a professional match analysis in JSON format.
        MATCH: ${matchData.home} vs ${matchData.away} | LEAGUE: ${matchData.leagueName}
        STRICT MARKET SELECTION: ${allowedMarkets.join(', ')}
        FORMAT: Return ONLY JSON with fields: AI_Signal_Outcome, AI_Strategic_Analysis (HTML), Global_Distribution_Matrix (home,draw,away), AI_Confidence_Index, Market_Odds.
        `;

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        return {
            prediction: content.AI_Signal_Outcome,
            analysis: content.AI_Strategic_Analysis,
            confidence: content.AI_Confidence_Index,
            distribution: content.Global_Distribution_Matrix,
            odds: parseFloat(content.Market_Odds) || 1.85
        };
    } catch (err: any) {
        logs.push(`❌ DeepSeek Error: ${err.message}`);
        return null;
    }
}

async function runBot() {
    const logs: string[] = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matchDate = tomorrow.toISOString().split('T')[0];

    console.log(`🚀 STARTING GITHUB BOT FOR: ${matchDate}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    try {
        await page.goto('https://www.flashscore.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait and accept cookies
        try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch (e) { }

        // Navigate to tomorrow's matches
        const nextBtn = await page.waitForSelector('button.wcl-arrow_YpdN4[data-day-picker-arrow="next"]', { timeout: 10000 });
        if (nextBtn) {
            await nextBtn.click();
            await page.waitForTimeout(5000);
        }

        // Scroll to load matches
        for (let i = 0; i < 3; i++) {
            await page.evaluate(() => window.scrollBy(0, 1000));
            await page.waitForTimeout(1000);
        }

        // Scrape Match List
        const rawMatches = await page.evaluate(() => {
            const results: any[] = [];
            const allElements = document.querySelectorAll('.headerLeague, .event__match');
            let lastLeagueName = 'General';
            let lastCountryName = 'International';

            allElements.forEach(el => {
                if (el.classList.contains('headerLeague')) {
                    const rawHeader = el.textContent || '';
                    if (rawHeader.includes(':')) {
                        const parts = rawHeader.split(':');
                        lastCountryName = parts[0].trim();
                        lastLeagueName = parts[1].trim();
                    }
                } else {
                    const home = el.querySelector('.event__homeParticipant .wcl-name_jjfMf')?.textContent?.trim();
                    const away = el.querySelector('.event__awayParticipant .wcl-name_jjfMf')?.textContent?.trim();
                    const time = el.querySelector('.event__time')?.textContent?.trim() || '21:00';
                    const matchUrl = (el.querySelector('a') as HTMLAnchorElement)?.href;
                    if (home && away && matchUrl) {
                        results.push({ home, away, time, matchUrl, leagueName: lastLeagueName, countryName: lastCountryName });
                    }
                }
            });
            return results;
        });

        console.log(`Extracted ${rawMatches.length} matches. Processing...`);

        const limit = 20; // Process top 20 matches per day via GitHub Actions to stay within resources
        for (const match of rawMatches.slice(0, limit)) {
            const baseSlug = `${slugify(match.home)}-vs-${slugify(match.away)}-${matchDate}`;
            const seoSlug = generateSEOSlug(match.home, match.away, baseSlug);

            // Check if exists
            const { data: exists } = await supabaseAdmin.from('predictions').select('id').eq('slug', seoSlug).single();
            if (exists) continue;

            console.log(`Analyzing: ${match.home} vs ${match.away}`);
            const ai = await getDeepSeekAnalysis({ ...match, matchDate }, logs);

            if (ai) {
                await supabaseAdmin.from('predictions').upsert([{
                    home_team: match.home,
                    away_team: match.away,
                    prediction: ai.prediction,
                    odds: ai.odds,
                    match_date: matchDate,
                    match_time: match.time,
                    league: match.leagueName,
                    confidence: ai.confidence,
                    analysis: ai.analysis,
                    category: 'Football',
                    status: 'Upcoming',
                    slug: seoSlug,
                    dist_home: ai.distribution?.home || 33,
                    dist_draw: ai.distribution?.draw || 33,
                    dist_away: ai.distribution?.away || 34,
                }]);
                console.log(`✅ Success: ${match.home}`);
            }
        }
    } catch (error: any) {
        console.error(`CRITICAL ERROR: ${error.message}`);
    } finally {
        await browser.close();
        console.log("🏁 BOT FINISHED");
    }
}

runBot();
