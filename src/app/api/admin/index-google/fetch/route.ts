import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSEOSlug } from '@/lib/utils'; // if you have this in utils

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'predictions';
    const date = searchParams.get('date'); // optional
    const q = searchParams.get('q'); // optional

    try {
        let urls: { url: string, title?: string, type: string }[] = [];
        const baseUrl = 'https://richpredict.com';

        if (type === 'static') {
            urls = [
                { url: `${baseUrl}/`, title: 'Homepage', type: 'static' },
                { url: `${baseUrl}/predictions`, title: 'Predictions', type: 'static' },
                { url: `${baseUrl}/news`, title: 'News', type: 'static' },
                { url: `${baseUrl}/football`, title: 'Football', type: 'static' },
                { url: `${baseUrl}/tennis`, title: 'Tennis', type: 'static' },
                { url: `${baseUrl}/basketball`, title: 'Basketball', type: 'static' },
            ];
        } else if (type === 'predictions') {
            let query = supabaseAdmin.from('predictions').select('home_team, away_team, slug, match_date, category').order('match_date', { ascending: false }).limit(200);

            if (date) {
                // assume date is "YYYY-MM-DD"
                query = query.gte('match_date', `${date}T00:00:00Z`).lte('match_date', `${date}T23:59:59.999Z`);
            }
            if (q) {
                query = query.or(`home_team.ilike.%${q}%,away_team.ilike.%${q}%`);
            }

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                urls = data.map(m => {
                    return {
                        url: `${baseUrl}/predictions/${generateSEOSlug(m.home_team, m.away_team, m.slug || '')}`,
                        title: `${m.home_team} vs ${m.away_team}`,
                        type: 'predictions'
                    };
                });
            }
        } else if (type === 'news') {
            let query = supabaseAdmin.from('blog_posts').select('title, slug, created_at').eq('published', true).order('created_at', { ascending: false }).limit(100);
            if (q) query = query.ilike('title', `%${q}%`);

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                urls = data.map(n => ({
                    url: `${baseUrl}/news/${n.slug}`,
                    title: n.title,
                    type: 'news'
                }));
            }
        } else if (type === 'countries') {
            let query = supabaseAdmin.from('countries').select('name, slug').order('name', { ascending: true }).limit(200);
            if (q) query = query.ilike('name', `%${q}%`);

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                urls = data.map(c => ({
                    url: `${baseUrl}/football/${c.slug}`,
                    title: c.name,
                    type: 'countries'
                }));
            }
        } else if (type === 'leagues') {
            let query = supabaseAdmin.from('leagues').select('name, slug').order('name', { ascending: true }).limit(200);
            if (q) query = query.ilike('name', `%${q}%`);

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                urls = data.map(l => ({
                    url: `${baseUrl}/football/league/${l.slug}`,
                    title: l.name,
                    type: 'leagues'
                }));
            }
        }

        // Fetch index status from google_indexing_logs if the table exists
        let logMap: Record<string, any> = {};
        const urlArray = urls.map(u => u.url);

        if (urlArray.length > 0) {
            const { data: logsData, error: logsError } = await supabaseAdmin
                .from('google_indexing_logs')
                .select('*')
                .in('url', urlArray)
                .order('created_at', { ascending: false });

            if (!logsError && logsData) {
                // keep the latest status
                for (const row of logsData) {
                    if (!logMap[row.url]) {
                        logMap[row.url] = row;
                    }
                }
            }
        }

        const enrichedUrls = urls.map(u => ({
            ...u,
            status: logMap[u.url]?.status || 'NOT_SENT',
            last_indexed: logMap[u.url]?.created_at || null,
        }));

        return NextResponse.json({ success: true, data: enrichedUrls });

    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
