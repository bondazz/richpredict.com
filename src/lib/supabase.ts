import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Separate client for admin actions (uses service role key to bypass RLS)
// Note: This will only be available on the server side
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : supabase

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
    id: string
    created_at: string
    title: string
    slug: string
    content: string
    excerpt: string
    image_url?: string
    author?: string
    published: boolean
}

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

export const getPredictions = async (limit = 50, category?: string) => {
    // Stage 1: Try with category filter if specified
    if (category) {
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
            .order('match_date', { ascending: false })
            .limit(limit);

        // Exclude premium matches from the regular list
        query = query.or('is_premium.is.null,is_premium.eq.false');

        if (category.toLowerCase() === 'football') {
            query = query.or(`category.ilike.Football,category.is.null`);
        } else {
            query = query.ilike('category', category);
        }

        const { data, error } = await query;

        // If no error, return result
        if (!error) return data as Prediction[];

        // If error is about the join (42703 or similar), fallback to simple select
        console.warn('Falling back to simple select due to missing league_id link:', error.message);
    }

    // Stage 2: Fallback to simple query
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
        .order('match_date', { ascending: false })
        .limit(limit);

    const { data: finalData, error: finalError } = await query;

    if (finalError) {
        // Absolute fallback if relational query fails entirely
        const { data: rawData, error: rawError } = await supabase
            .from('predictions')
            .select('*')
            .order('match_date', { ascending: false })
            .limit(limit);

        if (rawError) {
            console.warn('Error fetching predictions even in absolute fallback:', rawError.message || rawError);
            return [];
        }
        return rawData as Prediction[];
    }

    return finalData as Prediction[];
}

export const getBlogPosts = async (limit = 6) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        // Handle common errors like missing table (42P01) or PostgREST missing rows (PGRST116)
        // We log as warning instead of error to avoid triggering Next.js 15 dev error overlay
        const isTableMissing = error.code === '42P01' || error.message?.includes('does not exist');

        if (!isTableMissing) {
            console.warn('Blog posts fetch notice:', error.message || 'Table might be empty or missing.');
        }

        return []
    }

    return data as BlogPost[]
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

export const getPredictionBySlug = async (slug: string) => {
    // 1. Try exact match
    let { data, error } = await supabase
        .from('predictions')
        .select(`
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
        `)
        .eq('slug', slug)
        .maybeSingle()

    if (!error && data) return data as Prediction

    // 2. Try to parse SEO slug format: [home]-vs-[away]-predictions...-[suffix]
    const parts = slug.split('-')
    const previewIndex = parts.indexOf('previews')

    // Extract suffix (usually a date or ID)
    const suffix = previewIndex !== -1 ? parts.slice(previewIndex + 1).join('-') : parts[parts.length - 1]

    // Extract home and away team names from the beginning of the slug
    // Format is usually: home-name-vs-away-name-predictions...
    const vsIndex = parts.indexOf('vs')
    let homePart = ''
    let awayPart = ''

    if (vsIndex !== -1) {
        homePart = parts.slice(0, vsIndex).join(' ')
        // Find "predictions" to mark the end of the away team name
        const predIndex = parts.indexOf('predictions')
        if (predIndex !== -1) {
            awayPart = parts.slice(vsIndex + 1, predIndex).join(' ')
        }
    }

    let query = supabase
        .from('predictions')
        .select(`
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
        `)

    // We must match the suffix (date) AND either of the team names
    if (homePart && awayPart) {
        query = query.ilike('home_team', `%${homePart}%`).ilike('away_team', `%${awayPart}%`)
    } else if (homePart) {
        query = query.ilike('home_team', `%${homePart}%`)
    }

    // Also filter by suffix (date part)
    query = query.ilike('slug', `%${suffix}%`)

    const { data: results, error: searchError } = await query.limit(5)

    if (searchError || !results || results.length === 0) {
        if (searchError) console.warn('Error fetching prediction by lookup:', searchError.message || searchError);
        return null
    }

    // Try to find the best match amongst results
    if (results.length > 1 && homePart) {
        const bestMatch = results.find(r =>
            r.home_team.toLowerCase().includes(homePart.toLowerCase()) ||
            homePart.toLowerCase().includes(r.home_team.toLowerCase())
        )
        if (bestMatch) return bestMatch as Prediction
    }

    return results[0] as Prediction
}

export const getCountriesByRegion = async () => {
    const { data, error } = await supabase
        .from('countries')
        .select('*, regions(name)')
        .order('name', { ascending: true })

    if (error) return []
    return data
}

export const getCountryById = async (id: string) => {
    const { data, error } = await supabase
        .from('countries')
        .select('*, regions(name)')
        .eq('id', id)
        .single()

    if (error) return null
    return data
}

export const getPinnedLeagues = async () => {
    const { data, error } = await supabase
        .from('leagues')
        .select('*, countries(name, flag_url)')
        .eq('is_pinned', true)
        .order('order_index', { ascending: true })

    if (error) return [] as League[]
    return data as League[]
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

export const getAllPredictions = async (limit = 100) => {
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
            *,
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

    const { data, error } = await query.limit(limit * 3);

    if (error) {
        console.error('Error fetching featured matches:', error);
        return [];
    }

    // Randomize and slice
    const shuffled = (data || []).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit) as Prediction[];
}
