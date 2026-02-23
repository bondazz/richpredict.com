import { NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    let browser: any = null;
    const logs: string[] = [];

    try {
        logs.push("🚀 Ölkə Bayraqları Sinxronizasiyası başladı...");

        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();

        logs.push("Flashscore açılır...");
        await page.goto('https://www.flashscore.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        // 1. SOLDAN ÖLKƏ SİYAHISINI GÖTÜR
        const countriesList = await page.evaluate(() => {
            const items: any[] = [];
            const container = document.querySelector('#category-left-menu');
            if (container) {
                const links = container.querySelectorAll('a.lmc__item');
                links.forEach(link => {
                    const name = link.querySelector('.lmc__elementName')?.textContent?.trim();
                    const url = (link as HTMLAnchorElement).href;
                    if (name && url && url.includes('/football/')) {
                        items.push({ name, url });
                    }
                });
            }
            return items;
        });

        logs.push(`${countriesList.length} ölkə tapıldı. Emal olunur...`);

        for (const country of countriesList) {
            try {
                // Bazada bu ölkə varmı yoxla (vaxt itirməmək üçün)
                const { data: dbCountry } = await supabaseAdmin
                    .from('countries')
                    .select('id, flag_url')
                    .ilike('name', country.name)
                    .single();

                if (!dbCountry) continue; // Bazada yoxdursa keç

                // Əgər artıq bayrağı varsa və şəkli varsa, keçə bilərik (isteğe bağlı)
                // if (dbCountry.flag_url) continue;

                logs.push(`🔍 ${country.name} üçün bayraq axtarılır...`);

                await page.goto(country.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

                // CSS-dən Arxa fon şəklini götür
                const flagUrl = await page.evaluate(() => {
                    const flagSpan = document.querySelector('span.breadcrumb__flag.flag');
                    if (flagSpan) {
                        const style = window.getComputedStyle(flagSpan);
                        const bgImage = style.backgroundImage; // format: url("...")
                        const match = bgImage.match(/url\(["']?([^"']+)["']?\)/);
                        if (match && match[1]) {
                            let url = match[1];
                            if (url.startsWith('/')) {
                                url = 'https://static.flashscore.com' + url;
                            }
                            return url;
                        }
                    }
                    return null;
                });

                if (flagUrl) {
                    const { error: updateError } = await supabaseAdmin
                        .from('countries')
                        .update({ flag_url: flagUrl })
                        .eq('id', dbCountry.id);

                    if (updateError) {
                        logs.push(`❌ ${country.name} update xətası: ${updateError.message}`);
                    } else {
                        logs.push(`✅ ${country.name} bayrağı yeniləndi: ${flagUrl}`);
                    }
                }

                // Saytın bloklamaması üçün qısa fasilə
                await new Promise(r => setTimeout(r, 500));

            } catch (err: any) {
                logs.push(`⚠️ ${country.name} emalında xəta: ${err.message}`);
            }
        }

        await browser.close();
        return NextResponse.json({ success: true, logs });

    } catch (error: any) {
        if (browser) await browser.close();
        return NextResponse.json({ success: false, error: error.message, logs });
    }
}
