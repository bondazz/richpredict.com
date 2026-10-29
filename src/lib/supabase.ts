import { createClient } from '@supabase/supabase-js'
import { slugifyCountry } from './utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;

// Separate client for admin actions (uses service role key to bypass RLS)
// Note: This will only be available on the server side
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey)
    : supabase;

// Database types
export type Region = {
    id: string
    name: string
    order_index: number
}

export type Country = {
    id: string
    name: string
    region_id: string
    flag_url: string
    code: string
    is_featured: boolean
}

export type League = {
    id: string
    name: string
    country_id: string
    logo_url: string
    is_pinned: boolean
    is_major: boolean
    order_index: number
}

export type Team = {
    id: string
    name: string
    country_id: string
    league_id?: string
    logo_url: string
    stadium: string
}

export type BlogPost = {
    id: string;
    created_at: string;
    updated_at: string;
    published_at?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image_url?: string;
    author?: string;
    published: boolean;

    // SEO Fields
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image_url?: string;
    canonical_url?: string;

    // Taxonomy
    tags?: string[];
    category?: string;
    language: string;
    is_indexable: boolean;
    reading_time?: number;
};

export type Prediction = {
    id: string
    created_at: string
    home_team: string
    away_team: string
    prediction: string
    odds: number
    match_date: string
    league: string // Keep for backward compatibility
    league_id?: string // New relational link
    status: string
    result: string
    slug: string
    analysis: string
    confidence: string
    venue?: string
    match_time: string
    category?: string
    is_premium?: boolean
    // Global Distribution
    dist_home?: number
    dist_draw?: number
    dist_away?: number
    // Joined data
    leagues?: {
        name: string
        logo_url: string
        country_id: string
        countries?: {
            name: string
            flag_url: string
            code: string
        }
    }
}

// Helper functions
export const getRegions = async () => {
    const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('order_index', { ascending: true })
    if (error) return []
    return data as Region[]
}

export const getPremiumPredictionsCount = async (sport: string) => {
    let query = supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

    // Handle sport filtering
    if (sport.toLowerCase() === 'football') {
        query = query.or(`category.ilike.Football,category.is.null`);
    } else {
        query = query.ilike('category', sport);
    }

    const { count, error } = await query;

    if (error) {
        // If column doesn't exist yet, return 0 or default
        console.warn("Error fetching premium count:", error.message || error);
        return 0;
    }

    return count || 0;
}

export const getPremiumPredictions = async (sport: string = 'Football') => {
    let query = supabase
        .from('predictions')
        .select(`
            *,
            leagues (
                name,
                logo_url,
                countries (
                    name,
                    flag_url,
                    code
                )
            )
        `)
        .eq('is_premium', true)
        .order('match_date', { ascending: true });

    if (sport.toLowerCase() === 'football') {
        query = query.or(`category.ilike.Football,category.is.null`);
    } else {
        query = query.ilike('category', sport);
    }

    const { data, error } = await query;
    if (error) return [];
    return data as Prediction[];
}

const PREDICTION_LIST_FIELDS = `
    id, created_at, home_team, away_team, prediction, odds, match_date, match_time, 
    league, league_id, status, result, slug, confidence, category, is_premium, 
    dist_home, dist_draw, dist_away
`;

export const getPredictions = async (limit = 50, category?: string, date?: string) => {
    // Stage 1: Try with category filter if specified
    let query = supabase
        .from('predictions')
        .select(`
            ${PREDICTION_LIST_FIELDS},
            leagues (
                name,
                logo_url,
                countries (
                    name,
                    flag_url,
                    code
                )
            )
        `)
        .order('match_date', { ascending: false })
        .limit(limit);

    // Filter by date if provided (match_date is TIMESTAMP or DATE)
    if (date) {
        query = query.eq('match_date', date);
    }

    // Exclude premium matches from the regular list
    query = query.or('is_premium.is.null,is_premium.eq.false');

    if (category) {
        if (category.toLowerCase() === 'football') {
            query = query.or(`category.ilike.Football,category.is.null`);
        } else {
            query = query.ilike('category', category);
        }
    }

    const { data, error } = await query;

    if (!error) return data as Prediction[];

    // Fallback if relational query fails
    console.warn('Falling back to simple select:', error.message);
    let simpleQuery = supabase
        .from('predictions')
        .select(PREDICTION_LIST_FIELDS)
        .order('match_date', { ascending: false })
        .limit(limit);

    if (date) simpleQuery = simpleQuery.eq('match_date', date);
    if (category) {
        if (category.toLowerCase() === 'football') {
            simpleQuery = simpleQuery.or(`category.ilike.Football,category.is.null`);
        } else {
            simpleQuery = simpleQuery.ilike('category', category);
        }
    }

    const { data: rawData, error: rawError } = await simpleQuery;
    if (rawError) return [];
    return rawData as Prediction[];
}

export const getBlogPosts = async (limit = 20) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, image_url, category, created_at, language')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) return []
    return data as BlogPost[]
}

export const insertBlogPost = async (post: Partial<BlogPost>) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single()

    if (error) {
        console.error('SUPABASE_ERROR:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        throw error;
    }
    return data as BlogPost
}

export const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating blog post:', error)
        throw error
    }
    return data as BlogPost
}

export const getBlogPostById = async (id: string) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching blog post by id:', error)
        return null
    }
    return data as BlogPost
}

export const getPredictionById = async (id: string | number) => {
    const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return null
    return data
}

const PREDICTION_FULL_SELECT = `
    *,
    leagues (
        name,
        logo_url,
        country_id,
        countries (
            name,
            flag_url,
            code
        )
    )
`;

export const getPredictionBySlug = async (slug: string) => {
    // 1. Try exact match or direct variant slugs
    const candidateSlugs = Array.from(new Set([
        slug,
        slug.replace('-predictions-betting-tips-match-previews-', '-'),
        slug.replace('-predictions-betting-tips-match-previews', ''),
        slug.replace('-prediction-', '-'),
        slug.replace(/-prediction$/, '')
    ]));

    const { data: exactData, error: exactError } = await supabase
        .from('predictions')
        .select(PREDICTION_FULL_SELECT)
        .in('slug', candidateSlugs)
        .limit(1)
        .maybeSingle();

    if (!exactError && exactData) return exactData as Prediction;

    // 2. Parse SEO slug format: [home]-vs-[away]-predictions-betting-tips-match-previews-[suffix]
    const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})$/);
    const parts = slug.split('-');
    const previewIndex = parts.indexOf('previews');
    const suffix = dateMatch
        ? dateMatch[1]
        : (previewIndex !== -1 ? parts.slice(previewIndex + 1).join('-') : parts[parts.length - 1]);

    // Strip trailing suffix and prediction/preview keywords to isolate home-vs-away
    const coreSlug = slug
        .replace(/-predictions-betting-tips-match-previews.*$/, '')
        .replace(/-?\d{4}-\d{2}-\d{2}$/, '')
        .replace(/-(predictions?-previews?|predictions?|previews?)$/, '');

    const vsParts = coreSlug.split('-vs-');
    const homePart = vsParts[0] ? vsParts[0].replace(/-/g, ' ') : '';
    const awayPart = vsParts[1] ? vsParts[1].replace(/-/g, ' ') : '';

    const cleanLook = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const homeClean = cleanLook(homePart);
    const awayClean = cleanLook(awayPart);

    // 3. Query matches on that date or with that slug suffix (limit 300 so busy matchdays never truncate)
    if (suffix) {
        const orFilter = dateMatch
            ? `match_date.eq.${suffix},slug.ilike.%${suffix}%`
            : `slug.ilike.%${suffix}%`;

        const { data: dateResults } = await supabase
            .from('predictions')
            .select(PREDICTION_FULL_SELECT)
            .or(orFilter)
            .limit(300);

        if (dateResults && dateResults.length > 0) {
            const bestMatch = dateResults.find(r => {
                const rHomeClean = cleanLook(r.home_team);
                const rAwayClean = cleanLook(r.away_team);
                return (rHomeClean && homeClean && (rHomeClean.includes(homeClean) || homeClean.includes(rHomeClean))) &&
                    (rAwayClean && awayClean && (rAwayClean.includes(awayClean) || awayClean.includes(rAwayClean)));
            });
            if (bestMatch) return bestMatch as Prediction;

            if (dateResults.length === 1) return dateResults[0] as Prediction;

            const partialMatch = dateResults.find(r => {
                const rHomeClean = cleanLook(r.home_team);
                const rAwayClean = cleanLook(r.away_team);
                return (rHomeClean && homeClean && (rHomeClean.includes(homeClean) || homeClean.includes(rHomeClean))) ||
                    (rAwayClean && awayClean && (rAwayClean.includes(awayClean) || awayClean.includes(rAwayClean)));
            });
            if (partialMatch) return partialMatch as Prediction;
        }
    }

    // 4. Fallback: search by team names directly across all dates
    if (homePart && awayPart) {
        const homeToken = homePart.split(' ').filter(Boolean)[0] || homePart;
        const { data: teamResults } = await supabase
            .from('predictions')
            .select(PREDICTION_FULL_SELECT)
            .ilike('home_team', `%${homeToken}%`)
            .order('match_date', { ascending: false })
            .limit(100);

        if (teamResults && teamResults.length > 0) {
            const bestTeamMatch = teamResults.find(r => {
                const rHomeClean = cleanLook(r.home_team);
                const rAwayClean = cleanLook(r.away_team);
                return (rHomeClean.includes(homeClean) || homeClean.includes(rHomeClean)) &&
                    (rAwayClean.includes(awayClean) || awayClean.includes(rAwayClean));
            });
            if (bestTeamMatch) return bestTeamMatch as Prediction;
        }
    }

    return null;
}

export const getCountriesByRegion = async (onlyActive = true) => {
    const { data, error } = await supabase
        .from('countries')
        .select('*, regions(name), leagues(id)')
        .order('name', { ascending: true })

    if (error || !data) return []

    const filtered = onlyActive
        ? data.filter((c: any) => Array.isArray(c.leagues) && c.leagues.length > 0)
        : data;

    // Deduplicate by slugified name and strip heavy nested leagues array from payload
    const seen = new Set<string>();
    const unique: any[] = [];
    for (const c of filtered) {
        const slug = slugifyCountry(c.name);
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);
        unique.push({
            id: c.id,
            name: c.name,
            code: c.code,
            flag_url: c.flag_url,
            region_id: c.region_id,
            is_featured: c.is_featured,
            regions: c.regions,
        });
    }

    return unique;
}

export const getCountryById = async (id: string) => {
    const { data, error } = await supabase
        .from('countries')
        .select('*, regions(name)')
        .eq('id', id)
        .limit(1)
        .maybeSingle()

    if (error) return null
    return data
}

const LEGACY_COUNTRY_SLUGS: Record<string, string> = {
    'betway-premiershipsouth-africa': 'South Africa',
    'copa-betano-do-brasilbrazil': 'Brazil',
    'liga-futve-aperturavenezuela': 'Venezuela',
    'uefa-youth-league-play-offseurope': 'Europe',
    'v-league-1vietnam': 'Vietnam',
    'antigua-barbuda': 'Antigua and Barbuda',
    'australia-oceania': 'Australia and Oceania',
    'north-central-america': 'North and Central America',
};

export const getCountryByName = async (name: string) => {
    const rawDecoded = decodeURIComponent(name).trim();
    const targetSlug = slugifyCountry(rawDecoded);

    if (LEGACY_COUNTRY_SLUGS[targetSlug]) {
        const mappedName = LEGACY_COUNTRY_SLUGS[targetSlug];
        const { data: mapped } = await supabase
            .from('countries')
            .select('*, regions(name)')
            .ilike('name', mappedName)
            .limit(1)
            .maybeSingle();
        if (mapped) return mapped;
    }

    const decodedName = rawDecoded.replace(/-/g, ' ');

    // 1. Try space-replaced name first (using limit(1).maybeSingle() so duplicates never throw)
    const { data: data1 } = await supabase
        .from('countries')
        .select('*, regions(name)')
        .ilike('name', decodedName)
        .limit(1)
        .maybeSingle();

    if (data1) return data1;

    // 2. Try raw name
    const { data: data2 } = await supabase
        .from('countries')
        .select('*, regions(name)')
        .ilike('name', rawDecoded)
        .limit(1)
        .maybeSingle();

    if (data2) return data2;

    // 3. Fallback: compare slugifyCountry against all countries
    const { data: allCountries } = await supabase
        .from('countries')
        .select('*, regions(name)');

    if (allCountries) {
        const matched = allCountries.find(c => slugifyCountry(c.name) === targetSlug);
        if (matched) return matched;
    }

    return null;
}

export const getPredictionsByCountry = async (countryId: string, limit = 50, date?: string) => {
    let query = supabase
        .from('predictions')
        .select(`
            ${PREDICTION_LIST_FIELDS},
            leagues!inner (
                name,
                logo_url,
                country_id,
                countries (
                    id,
                    name,
                    flag_url,
                    code
                )
            )
        `)
        .eq('leagues.country_id', countryId)
        .order('match_date', { ascending: false })
        .limit(limit);

    if (date) {
        query = query.eq('match_date', date);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching country predictions:', error);
        return [];
    }
    return data as Prediction[];
}

export const getPinnedLeagues = async () => {
    const { data, error } = await supabase
        .from('leagues')
        .select('*, countries(name, flag_url, code)')
        .eq('is_pinned', true)
        .order('order_index', { ascending: true })

    if (error) return [] as League[]
    return data as League[]
}

export const getLeaguesByCountry = async (countryId: string) => {
    const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('country_id', countryId)
        .order('name', { ascending: true });

    if (error) return [];
    return data;
}

export const getLeagues = async () => {
    const { data, error } = await supabase
        .from('leagues')
        .select('*, countries(name)')
        .order('name', { ascending: true })

    if (error) return []
    return data
}

export const getTeams = async () => {
    let allTeams: any[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('teams')
            .select(`
                id,
                name,
                logo_url,
                country_id,
                league_id,
                leagues (
                    name
                ),
                countries (
                    name
                )
            `)
            .order('name', { ascending: true })
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error('Error fetching teams:', error);
            return allTeams; // Return what we have so far
        }

        if (data && data.length > 0) {
            allTeams = [...allTeams, ...data];
            page++;
            if (data.length < pageSize) hasMore = false;
        } else {
            hasMore = false;
        }

        // Safety break to prevent infinite loops (max 10k teams for now)
        if (page > 10) hasMore = false;
    }

    return allTeams;
}

export const getTeamsByNames = async (names: string[]) => {
    if (!names || names.length === 0) return [];

    // Split into chunks of 100 to avoid long queries
    const chunks = [];
    for (let i = 0; i < names.length; i += 100) {
        chunks.push(names.slice(i, i + 100));
    }

    const results = await Promise.all(chunks.map(chunk =>
        supabase
            .from('teams')
            .select('name, logo_url')
            .in('name', chunk)
    ));

    const allTeams = results.flatMap(r => r.data || []);
    return allTeams;
}

export const getTotalPredictionsStats = async () => {
    const [totalRes, premiumRes, footballRes] = await Promise.all([
        supabase.from('predictions').select('*', { count: 'exact', head: true }),
        supabase.from('predictions').select('*', { count: 'exact', head: true }).eq('is_premium', true),
        supabase.from('predictions').select('*', { count: 'exact', head: true }).or(`category.ilike.Football,category.is.null`)
    ]);

    const total = totalRes.count || 0;
    const premium = premiumRes.count || 0;
    const football = footballRes.count || 0;

    return {
        total,
        premium,
        football,
        other: total - football
    };
}

export const getAllPredictions = async (limit = 200) => {
    const { data, error } = await supabase
        .from('predictions')
        .select(`
            *,
            leagues (
                name,
                logo_url,
                countries (
                    name,
                    flag_url
                )
            )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching all predictions:', error)
        return []
    }

    return data as Prediction[]
}

export const getFeaturedMatches = async (countryId?: string, limit = 10, category?: string) => {
    const today = new Date().toISOString().split('T')[0];

    let query = supabase
        .from('predictions')
        .select(`
            ${PREDICTION_LIST_FIELDS},
            leagues!inner (
                name,
                logo_url,
                country_id,
                countries (
                    name,
                    flag_url,
                    code
                )
            )
        `)
        .gte('match_date', today)
        .order('match_date', { ascending: true });

    if (countryId) {
        query = query.eq('leagues.country_id', countryId);
    }

    if (category) {
        if (category.toLowerCase() === 'football') {
            query = query.or(`category.ilike.Football,category.is.null`);
        } else {
            query = query.ilike('category', category);
        }
    }

    let { data } = await query.limit(limit * 3);

    // Fallback: If no matches found for future dates, fetch latest available matches
    if (!data || data.length === 0) {
        let fallbackQuery = supabase
            .from('predictions')
            .select(`
                ${PREDICTION_LIST_FIELDS},
                leagues!inner (
                    name,
                    logo_url,
                    country_id,
                    countries (
                        name,
                        flag_url,
                        code
                    )
                )
            `)
            .order('match_date', { ascending: false });

        if (countryId) {
            fallbackQuery = fallbackQuery.eq('leagues.country_id', countryId);
        }

        if (category) {
            if (category.toLowerCase() === 'football') {
                fallbackQuery = fallbackQuery.or(`category.ilike.Football,category.is.null`);
            } else {
                fallbackQuery = fallbackQuery.ilike('category', category);
            }
        }

        const fallbackRes = await fallbackQuery.limit(limit * 3);
        data = fallbackRes.data || [];
    }

    // Deterministic selection instead of Math.random() so ISR cache stays consistent
    return (data || []).slice(0, limit) as Prediction[];
}

export const getSynchronizedStats = () => {
    const now = new Date();
    const utcMonth = now.getUTCMonth();
    const utcYear = now.getUTCFullYear();

    // 1. Premium Analysts Sync Logic
    // Resets every month. Base: 186. +1-4 every 5 minutes.
    const startOfMonth = new Date(Date.UTC(utcYear, utcMonth, 1)).getTime();
    const elapsedMs = now.getTime() - startOfMonth;
    const fiveMinIntervals = Math.floor(elapsedMs / (5 * 60 * 1000));

    let premiumTotal = 186;
    // Deterministically calculate the total increment since start of month
    for (let i = 0; i < fiveMinIntervals; i++) {
        // Pseudo-random deterministic increment (1-4)
        premiumTotal += ((i * 17 + 11) % 4) + 1;
    }

    const lastIncrement = ((fiveMinIntervals * 17 + 11) % 4) + 1;

    // Online Users Sync Logic (10s intervals)
    const tenSecIntervalsSinceEpoch = Math.floor(now.getTime() / 10000);
    const stepInSequence = tenSecIntervalsSinceEpoch % 4;
    const hourSeed = Math.floor(now.getTime() / (3600 * 1000));
    const blockTypeSeed = (hourSeed * 13 + Math.floor(tenSecIntervalsSinceEpoch / 40)) % 2;

    const dailySeed = Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
    const dailyBase = 1200 + ((dailySeed * 123) % 1200);

    const longTermCycle = (tenSecIntervalsSinceEpoch % 90) / 90;
    const waveBase = dailyBase + Math.sin(longTermCycle * Math.PI * 2) * 800;

    let onlineCount = waveBase;

    if (blockTypeSeed === 0) {
        if (stepInSequence < 3) {
            onlineCount += (stepInSequence * 150) + (tenSecIntervalsSinceEpoch % 30);
        } else {
            onlineCount += 200 - (tenSecIntervalsSinceEpoch % 40);
        }
    } else {
        if (stepInSequence < 3) {
            onlineCount -= (stepInSequence * 150) + (tenSecIntervalsSinceEpoch % 30);
        } else {
            onlineCount -= 200 - (tenSecIntervalsSinceEpoch % 40);
        }
    }

    const finalOnline = Math.max(947, Math.min(5000, Math.floor(onlineCount)));

    return {
        premium: premiumTotal,
        online: finalOnline,
        lastIncrement: lastIncrement
    };
};

export const getSiteSettings = async (id: string) => {
    const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('id', id)
        .single()
    if (error) return null
    return data.value
}
