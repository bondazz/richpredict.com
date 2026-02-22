import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';

export const runtime = 'nodejs'; // Playwright needs Node.js runtime, not Edge

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
);

export async function POST(req: NextRequest) {
    const { url, leagueId: initialLeagueId } = await req.json();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const sendLog = (msg: string) => {
                controller.enqueue(encoder.encode(JSON.stringify({ log: msg }) + '\n'));
            };

            const sendStatus = (status: 'success' | 'error', message?: string) => {
                controller.enqueue(encoder.encode(JSON.stringify({ status, message }) + '\n'));
            };

            let browser;
            try {
                sendLog('Launching Autonomous Intelligence Engine...');
                browser = await chromium.launch({ headless: true });

                const scanPage = await browser.newPage();
                sendLog(`Infiltrating target sector: ${url}`);
                await scanPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

                // 1. EXTRACT LEAGUE DATA AUTOMATICALLY
                const extractedLeague = await scanPage.evaluate(() => {
                    const nameEl = document.querySelector('.heading__name');
                    const logoEl = document.querySelector('.heading__logo');

                    // Improved breadcrumb extraction
                    const breadcrumbItems = Array.from(document.querySelectorAll('.breadcrumb__item')).map(el => el.textContent?.trim()).filter(Boolean);

                    // URL-based extraction as secondary source
                    const urlParts = window.location.pathname.split('/').filter(Boolean);
                    // Expected: /football/algeria/ligue-1/standings -> ['football', 'algeria', 'ligue-1', 'standings']

                    let countryNameFromUrl = '';
                    if (urlParts.length >= 2) {
                        countryNameFromUrl = urlParts[1].charAt(0).toUpperCase() + urlParts[1].slice(1).replace(/-/g, ' ');
                    }

                    return {
                        name: nameEl?.textContent?.trim(),
                        logo: (logoEl as HTMLImageElement)?.src,
                        countryName: breadcrumbItems[breadcrumbItems.length - 2] || countryNameFromUrl || null
                    };
                });

                // Sanitize and Normalize Country Identity
                const finalCountryName = extractedLeague.countryName?.replace(/[\s\/\\]+$/, '').trim();
                sendLog(`Neural_Scanner: Detected Sector Identity -> [${extractedLeague.name}]`);
                sendLog(`Neural_Scanner: Detected Regional Origin -> [${finalCountryName}]`);

                // 2. MAP COUNTRY
                const { data: countryData } = await supabase
                    .from('countries')
                    .select('id, name')
                    .ilike('name', finalCountryName || '')
                    .maybeSingle();

                const countryId = countryData?.id;
                if (!countryId) {
                    throw new Error(`CRITICAL: Regional Origin '${finalCountryName}' is not registered in our temporal database.`);
                }
                sendLog(`↳ Regional Origin Verified: ${countryData.name} (ID: ${countryId})`);

                // 3. MAP OR CREATE LEAGUE
                let leagueId = initialLeagueId;

                // Safety Verification: Ensure manually selected league belongs to the detected country
                if (leagueId) {
                    const { data: manualLeague } = await supabase
                        .from('leagues')
                        .select('country_id, name')
                        .eq('id', leagueId)
                        .single();

                    if (manualLeague && manualLeague.country_id !== countryId) {
                        sendLog(`⚠️ WARNING: Manually selected league [${manualLeague.name}] belongs to a different country node.`);
                        sendLog(`↳ Redirecting to autonomous detection for [${countryData.name}] scope...`);
                        leagueId = null; // Force auto-detection to stay in the correct country
                    }
                }

                if (!leagueId) {
                    sendLog(`Neural_Scanner: Searching for specific League Node in [${countryData.name}]...`);
                    const { data: existingLeague } = await supabase
                        .from('leagues')
                        .select('id, name, country_id')
                        .eq('name', extractedLeague.name)
                        .eq('country_id', countryId)
                        .maybeSingle();

                    if (existingLeague) {
                        leagueId = existingLeague.id;
                        sendLog(`↳ League Node Synchronized: ${existingLeague.name} (Country: ${countryData.name})`);
                    } else {
                        sendLog(`↳ League Node [${extractedLeague.name}] not found in [${countryData.name}]. Initiating creation protocol...`);
                        const { data: newLeague, error: lError } = await supabase
                            .from('leagues')
                            .insert({
                                name: extractedLeague.name,
                                country_id: countryId,
                                logo_url: extractedLeague.logo
                            })
                            .select()
                            .single();

                        if (lError) throw lError;
                        leagueId = newLeague.id;
                        sendLog(`↳ SUCCESS: Registered new League Node [${extractedLeague.name}] for [${countryData.name}] (ID: ${leagueId})`);
                    }
                } else {
                    sendLog(`Neural_Scanner: Confirmed League Node [ID: ${leagueId}] within [${countryData.name}] sector.`);
                }

                // 4. SCAN TEAMS
                sendLog(`Neural_Scanner: Harvesting team data for [${countryData.name}] -> [${extractedLeague.name}]...`);
                await scanPage.waitForSelector('.ui-table__row', { timeout: 15000 });

                // Ensure table logos are loaded by scrolling and waiting
                await scanPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                await scanPage.waitForTimeout(2000);

                const teamsData = await scanPage.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('.ui-table__row'));
                    return rows.map(row => {
                        const linkEl = row.querySelector('.tableCellParticipant__image, .tableCellParticipant');
                        const nameEl = row.querySelector('.tableCellParticipant__name');
                        if (!linkEl || !nameEl) return null;

                        const img = row.querySelector('img');
                        // Capture data-src or src to handle lazy-loading
                        const logoUrl = img?.getAttribute('data-src') || img?.src;

                        return {
                            name: nameEl.textContent?.trim(),
                            link: (row.querySelector('a') as HTMLAnchorElement)?.href || (linkEl as HTMLAnchorElement).href,
                            logoUrl: logoUrl
                        };
                    }).filter(Boolean);
                });

                await scanPage.close();
                sendLog(`Signal locked: Detected ${teamsData.length} team entities.`);
                sendLog('--------------------------------------------------');

                // 5. PARALLEL HARVEST
                const CONCURRENCY = 8;
                for (let i = 0; i < teamsData.length; i += CONCURRENCY) {
                    const batch = teamsData.slice(i, i + CONCURRENCY);
                    sendLog(`Processing BATCH ${Math.floor(i / CONCURRENCY) + 1} (${batch.length} entities)...`);

                    await Promise.all(batch.map(async (team: any) => {
                        let teamPage;
                        try {
                            teamPage = await browser.newPage();
                            // Permissive routing: only abort trackers/ads, allow all images
                            await teamPage.route('**/*', (route) => {
                                const rUrl = route.request().url();
                                if (rUrl.includes('google-analytics') || rUrl.includes('doubleclick') || rUrl.includes('ads')) {
                                    route.abort();
                                } else {
                                    route.continue();
                                }
                            });

                            await teamPage.goto(team.link, { waitUntil: 'networkidle', timeout: 30000 });

                            // Advanced Persistent Logo Polling
                            const finalHighResLogo = await teamPage.evaluate(async () => {
                                const poll = async (ms: number) => new Promise(res => setTimeout(res, ms));

                                for (let attempt = 0; attempt < 10; attempt++) { // Poll for up to 5 seconds (10 * 500ms)
                                    const selectors = [
                                        '.heading__logo img',
                                        'img.heading__logo',
                                        '.teamHeader__logo img',
                                        'img[class*="logo"]',
                                        '.header__participant img'
                                    ];

                                    for (const selector of selectors) {
                                        const el = document.querySelector(selector) as HTMLImageElement;
                                        const src = el?.src || el?.getAttribute('data-src');
                                        if (src && src.startsWith('http') && !src.includes('placeholder') && !src.includes('transparent') && !src.endsWith('.gif')) {
                                            return src;
                                        }
                                    }

                                    // Check Background Images
                                    const bgEls = Array.from(document.querySelectorAll('.heading__logo, .teamHeader__logo, .participant-img'));
                                    for (const el of bgEls) {
                                        const style = window.getComputedStyle(el);
                                        const bg = style.backgroundImage;
                                        if (bg && bg.includes('url') && !bg.includes('placeholder') && !bg.includes('transparent') && !bg.endsWith('.gif')) {
                                            const match = bg.match(/url\(["']?([^"']+)["']?\)/);
                                            if (match && match[1].startsWith('http')) return match[1];
                                        }
                                    }

                                    await poll(500); // Wait 500ms before next poll
                                }
                                return null;
                            }).catch(() => null);

                            const finalLogo = finalHighResLogo || team.logoUrl;

                            // Final URL Cleanup check: if it's a known spacer or placeholder, set to null
                            const isInvalid = !finalLogo ||
                                finalLogo.includes('placeholder') ||
                                finalLogo.includes('transparent.gif') ||
                                finalLogo.includes('base64') ||
                                finalLogo.endsWith('.gif'); // Catch any remaining .gif files

                            const validLogo = isInvalid ? null : finalLogo;

                            if (validLogo) {
                                sendLog(`↳ SOURCE_SUCCESS: ${team.name} -> ${validLogo}`);
                            } else {
                                sendLog(`↳ ⚠️ SOURCE_FAILED: ${team.name} (Identity asset not found)`);
                            }

                            // DUPLICATE & SYNC CHECK
                            const { data: existingTeam } = await supabase
                                .from('teams')
                                .select('id, logo_url, league_id')
                                .eq('name', team.name)
                                .eq('country_id', countryId)
                                .maybeSingle();

                            if (!existingTeam) {
                                const { error: insError } = await supabase
                                    .from('teams')
                                    .insert({
                                        name: team.name,
                                        logo_url: validLogo,
                                        country_id: countryId,
                                        league_id: leagueId
                                    });

                                if (!insError) sendLog(`[SUCCESS] Registered: ${team.name}`);
                                else sendLog(`[ERROR] DB_INSERT ${team.name}: ${insError.message}`);
                            } else {
                                sendLog(`[SKIP] Already exists: ${team.name}`);
                                // Auto-Update Identity Assets
                                const updates: any = {};
                                if (validLogo && existingTeam.logo_url !== validLogo) updates.logo_url = validLogo;
                                if (existingTeam.league_id !== leagueId) updates.league_id = leagueId;

                                if (Object.keys(updates).length > 0) {
                                    await supabase.from('teams').update(updates).eq('id', existingTeam.id);
                                    sendLog(`↳ Identity synchronized for ${team.name}`);
                                }
                            }
                        } catch (err: any) {
                            sendLog(`[FAILED] Processing ${team.name}: ${err.message}`);
                        } finally {
                            if (teamPage) await teamPage.close();
                        }
                    }));
                }

                sendLog('--------------------------------------------------');
                sendLog('HARVEST_SEQUENCE_SUCCESS: Neural Network Synchronized.');
                sendStatus('success');

            } catch (error: any) {
                sendLog(`CRITICAL_SYSTEM_ERROR: ${error.message}`);
                sendStatus('error', error.message);
            } finally {
                if (browser) await browser.close();
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
