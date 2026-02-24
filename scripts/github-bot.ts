import { createClient } from '@supabase/supabase-js';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials.");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
    if (!deepseekApiKey) {
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
        
        MATCH: ${matchData.home} vs ${matchData.away}
        LEAGUE: ${matchData.leagueName}
        
        STRICT MARKET SELECTION (You MUST choose EXACTLY one from this list):
        ${allowedMarkets.join(', ')}

        CORE ANALYSIS REQUIREMENTS:
        1. CONTENT: Minimum 350-500 words. Write as an expert betting consultant.
        2. HTML STRUCTURE: You MUST follow this exact template for 'AI_Strategic_Analysis':
           <h2>[Specific Match Title] - Tactical Analysis & Betting Verdict</h2>
           <p>[Opening professional insight...]</p>
           <h3>Tactical Overview</h3>
           <p>[Deep dive into systems, manager tactics...]</p>
           <h3>Key Player Impact & Team News</h3>
           <p>[Injuries, influential players, expected rotations...]</p>
           <h3>Statistical Trends (H2H, Recent Form)</h3>
           <p>[Data-driven analysis of past encounters and current streaks...]</p>
           <h3>Final Betting Verdict</h3>
           <p>[Summarize why the chosen market is the best play...]</p>
        
        3. DYNAMIC METRICS:
           - AI_Confidence_Index: Provide a unique percentage (60-80%).
           - Market_Odds: Realistic decimal odds (e.g., 1.95).
           - Global_Distribution_Matrix: Realistic world sentiment (Sums to 100).

        RETURN ONLY JSON:
        {
          "AI_Signal_Outcome": "EXACT_MARKET_FROM_LIST",
          "AI_Strategic_Analysis": "HTML_CONTENT_FOLLOWING_TEMPLATE",
          "Global_Distribution_Matrix": {"home": X, "draw": Y, "away": Z},
          "AI_Confidence_Index": "Unique %",
          "Market_Odds": 0.00
        }`;

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${deepseekApiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a world-class football tipster. You ONLY provide predictions from the official market list and follow strict HTML formatting." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data: any = await response.json();
        const content = JSON.parse(data.choices[0].message.content);

        // Sanitize Outcome
        let finalOutcome = content.AI_Signal_Outcome;
        if (!allowedMarkets.includes(finalOutcome)) {
            finalOutcome = allowedMarkets.find(m => m.toLowerCase().includes(finalOutcome.toLowerCase())) || 'Home Win';
        }

        return {
            prediction: finalOutcome,
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
    let browser: Browser | null = null;

    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const matchDate = tomorrow.toISOString().split('T')[0];
        const maxMatches = 100; // Increased for GitHub Actions

        console.log(`🚀 BOT: DeepSeek AI Strategic Sync (GitHub Edition)`);
        console.log(`Target Date: ${matchDate}`);

        const { data: regions } = await supabaseAdmin.from('regions').select('*').order('order_index');
        const defaultRegionId = regions?.[0]?.id;

        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            viewport: { width: 1440, height: 1200 }
        });

        const page = await context.newPage();
        console.log("Opening Flashscore...");
        await page.goto('https://www.flashscore.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        try {
            const cookieBtn = await page.waitForSelector('#onetrust-accept-btn-handler', { timeout: 5000 });
            if (cookieBtn) {
                await cookieBtn.click();
                console.log("Cookies accepted.");
            }
        } catch (e) { }

        // 1. DATE NAVIGATION
        const targetDateObj = new Date(matchDate);
        const todayObj = new Date();
        const diffDays = Math.round((targetDateObj.getTime() - todayObj.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            console.log(`Navigating forward ${diffDays} day(s)...`);
            for (let i = 0; i < diffDays; i++) {
                const nextBtn = await page.waitForSelector('button.wcl-arrow_YpdN4[data-day-picker-arrow="next"]', { timeout: 10000 });
                if (nextBtn) {
                    await nextBtn.click();
                    await page.waitForTimeout(5000);
                    console.log(`Step: Moved to next day.`);
                }
            }
        }

        // Scrolling
        console.log("Scrolling to load fixtures...");
        for (let i = 0; i < 4; i++) {
            await page.evaluate(() => window.scrollBy(0, 1500));
            await page.waitForTimeout(1500);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(1000);

        // 2. WAIT FOR AND SCRAPE MATCH LIST (TARGETING #live-table)
        await page.waitForSelector('#live-table', { timeout: 30000 });

        const rawMatches = await page.evaluate((limit) => {
            const results: any[] = [];
            const seenUrls = new Set();
            let lastLeagueName = 'General';
            let lastLeagueUrl = '';
            let lastCountryName = 'International';

            // Select specifically within the live-table container
            const container = document.querySelector('#live-table');
            if (!container) return [];

            const allElements = container.querySelectorAll('.headerLeague, .event__match, [class*="leagueHeader"], [class*="event__match"]');

            for (const el of Array.from(allElements)) {
                if (results.length >= limit) break;

                const isHeader = el.classList.contains('headerLeague') || el.className.includes('leagueHeader');

                if (isHeader) {
                    const categoryTextEl = el.querySelector('.headerLeague__category-text');
                    const titleTextEl = el.querySelector('.headerLeague__title-text');
                    const leagueUrl = (el.querySelector('.headerLeague__title') as HTMLAnchorElement)?.href || '';

                    if (categoryTextEl) lastCountryName = categoryTextEl.textContent.trim();
                    if (titleTextEl) lastLeagueName = titleTextEl.textContent.trim();
                    if (leagueUrl) lastLeagueUrl = leagueUrl;
                } else {
                    const isMatch = el.classList.contains('event__match') || el.getAttribute('data-event-row') === 'true';
                    if (isMatch) {
                        const homeEl = el.querySelector('.event__homeParticipant');
                        const awayEl = el.querySelector('.event__awayParticipant');

                        const home = homeEl?.querySelector('.wcl-name_jjfMf, .wcl-scores_Na715')?.textContent?.trim();
                        const away = awayEl?.querySelector('.wcl-name_jjfMf, .wcl-scores_Na715')?.textContent?.trim();
                        const time = el.querySelector('.event__time')?.textContent?.trim() || '21:00';
                        const matchUrl = (el.querySelector('.eventRowLink') as HTMLAnchorElement)?.href;

                        const homeLogo = homeEl?.querySelector('img')?.getAttribute('src');
                        const awayLogo = awayEl?.querySelector('img')?.getAttribute('src');

                        if (home && away && matchUrl && !seenUrls.has(matchUrl)) {
                            seenUrls.add(matchUrl);
                            results.push({
                                home, away, time, matchUrl,
                                leagueName: lastLeagueName,
                                leagueUrl: lastLeagueUrl,
                                countryName: lastCountryName,
                                fallbackLogos: { home: homeLogo, away: awayLogo }
                            });
                        }
                    }
                }
            }
            return results;
        }, maxMatches);

        console.log(`Extracted ${rawMatches.length} matches. Starting High-Speed Sync...`);

        for (const match of rawMatches) {
            const baseSlug = `${slugify(match.home)}-vs-${slugify(match.away)}-${matchDate}`;
            const seoSlug = generateSEOSlug(match.home, match.away, baseSlug);

            // INSTANT DUPLICATE SKIP
            const { data: exists } = await supabaseAdmin.from('predictions').select('id').eq('slug', seoSlug).single();
            if (exists) {
                console.log(`⏩ Skipping ${match.home} - Already published.`);
                continue;
            }

            console.log(`-------------------------------------------`);
            console.log(`Syncing: ${match.home} vs ${match.away}`);

            // DB Assets Sync: Country
            let countryId = '';
            const { data: existingCountry } = await supabaseAdmin.from('countries').select('id, flag_url').ilike('name', match.countryName).single();

            if (existingCountry) {
                countryId = existingCountry.id;
            } else {
                const normalizedCountry = match.countryName.toUpperCase();
                const { data: regionMatch } = await supabaseAdmin.from('regions').select('id').ilike('name', normalizedCountry).single();
                const targetRegionId = regionMatch?.id || defaultRegionId;

                const { data: newCountry } = await supabaseAdmin.from('countries').insert([{
                    name: match.countryName,
                    region_id: targetRegionId
                }]).select().single();
                countryId = newCountry?.id || '';
            }

            if (!countryId) continue;

            // DB Assets Sync: League & Country Flag update
            let leagueId = '';
            const { data: existingLeague } = await supabaseAdmin.from('leagues').select('id, logo_url').eq('country_id', countryId).ilike('name', match.leagueName).single();

            const syncLeagueAndFlag = async () => {
                const lp = await context.newPage();
                try {
                    await lp.goto(match.leagueUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
                    const lurl = await lp.$eval('.heading__logo', (img: any) => img.src).catch(() => '');
                    const furl = await lp.$eval('.heading__flag img, img.heading__flag, .breadcrumb__flag img', (img: any) => img.src).catch(() => '');

                    if (furl) {
                        await supabaseAdmin.from('countries').update({ flag_url: furl }).eq('id', countryId);
                        console.log(`🏳️ Updated Country Flag: ${match.countryName}`);
                    }

                    if (existingLeague) {
                        if (!existingLeague.logo_url && lurl) {
                            await supabaseAdmin.from('leagues').update({ logo_url: lurl }).eq('id', existingLeague.id);
                            console.log(`✅ Updated League Logo: ${match.leagueName}`);
                        }
                        return existingLeague.id;
                    } else {
                        const { data: nl } = await supabaseAdmin.from('leagues').insert([{
                            name: match.leagueName,
                            country_id: countryId,
                            logo_url: lurl
                        }]).select().single();
                        return nl?.id || '';
                    }
                } catch (e: any) {
                    console.log(`⚠️ League sync failed for ${match.leagueName}: ${e.message}`);
                    return existingLeague?.id || '';
                } finally {
                    await lp.close();
                }
            };

            leagueId = await syncLeagueAndFlag();

            // TEAM LOGO SYNC (STRICT SINGLE ENTRY BY COUNTRY)
            const syncTeam = async (name: string, fallback: string) => {
                const { data: team } = await supabaseAdmin.from('teams')
                    .select('id, logo_url')
                    .eq('country_id', countryId)
                    .ilike('name', name)
                    .single();

                if (team) {
                    return { id: team.id, logo_url: team.logo_url || '' };
                } else {
                    const { data: nt } = await supabaseAdmin.from('teams').insert([{
                        name: name,
                        country_id: countryId,
                        league_id: leagueId || null,
                        logo_url: fallback
                    }]).select().single();
                    return { id: nt?.id || null, logo_url: fallback };
                }
            };

            const homeStatus = await syncTeam(match.home, match.fallbackLogos.home || '');
            const awayStatus = await syncTeam(match.away, match.fallbackLogos.away || '');

            // HD Logo fetch (Force from Match Detail)
            let homeHd = '', awayHd = '';
            const matchPage = await context.newPage();
            try {
                console.log(`🔍 Fetching HD logos: ${match.home} vs ${match.away}`);
                await matchPage.goto(match.matchUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });

                // Wait specifically for images and use ultra-precise selectors to avoid wrong logos
                await matchPage.waitForSelector('.duelParticipant__home .participant__image', { timeout: 5000 }).catch(() => { });

                homeHd = await matchPage.$eval('.duelParticipant__home img.participant__image', (img: any) => img.src).catch(() => '');
                awayHd = await matchPage.$eval('.duelParticipant__away img.participant__image', (img: any) => img.src).catch(() => '');

                // Only update if we found a valid new URL and it differs from what we have
                if (homeHd && homeHd.startsWith('http') && homeHd !== homeStatus.logo_url) {
                    await supabaseAdmin.from('teams').update({ logo_url: homeHd }).eq('id', homeStatus.id);
                    console.log(`🏠 HD Home Logo Updated: ${match.home}`);
                }
                if (awayHd && awayHd.startsWith('http') && awayHd !== awayStatus.logo_url) {
                    await supabaseAdmin.from('teams').update({ logo_url: awayHd }).eq('id', awayStatus.id);
                    console.log(`🚌 HD Away Logo Updated: ${match.away}`);
                }
            } catch (err: any) {
                console.log(`❌ HD logo fetch failed: ${err.message}`);
            }
            await matchPage.close();

            // AI ANALYSIS
            console.log(`Consulting DeepSeek AI for ${match.home}...`);
            const ai = await getDeepSeekAnalysis({ ...match, matchDate }, logs);

            if (ai) {
                await supabaseAdmin.from('predictions').upsert([{
                    home_team: match.home,
                    away_team: match.away,
                    prediction: ai.prediction,
                    odds: ai.odds || 1.85,
                    match_date: matchDate,
                    match_time: match.time,
                    league: match.leagueName,
                    league_id: leagueId || null,
                    confidence: ai.confidence,
                    analysis: ai.analysis,
                    category: 'Football',
                    status: 'Upcoming',
                    slug: seoSlug,
                    dist_home: ai.distribution?.home || 33,
                    dist_draw: ai.distribution?.draw || 33,
                    dist_away: ai.distribution?.away || 34,
                    created_at: new Date().toISOString()
                }], { onConflict: 'slug' });

                console.log(`✅ Published: ${seoSlug}`);
            } else {
                console.log(`⚠️ Skipping ${match.home} - AI service busy.`);
            }
        }

        console.log("🏁 BOT FINISHED SUCCESSFULLY.");

    } catch (error: any) {
        console.error(`💥 CRITICAL BOT ERROR: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

runBot();
