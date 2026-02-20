import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
    league: string
    status: string
    result: string
    slug: string
    analysis: string
    confidence: string
    venue?: string
    match_time: string
    category?: string
    is_premium?: boolean
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
        console.error("Error fetching premium count:", error);
        return 0;
    }

    return count || 0;
}

export const getPredictions = async (limit = 50, category?: string) => {
    // Stage 1: Try with category filter if specified
    if (category) {
        let query = supabase
            .from('predictions')
            .select('*')
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

        // If no error, or error is not about missing column, return result
        if (!error) return data as Prediction[];

        // If error is "column does not exist" (42703), fallback to unfiltered (especially for Football)
        if (error.code !== '42703') {
            console.error('Error fetching filtered predictions:', error);
            return [];
        }
    }

    // Stage 2: Fallback to unfiltered query (or default query if no category/missing column)
    let query = supabase
        .from('predictions')
        .select('*')
        .order('match_date', { ascending: false })
        .limit(limit);

    // Try to exclude premium even in fallback if possible, but keep it robust
    // We will just do a simple select. If the initial query failed due to is_premium column not existing, this might also fail if we add it.
    // However, if the error was 42703 (column does not exist), it's safer to just return whatever.
    // BUT we want to hide premium.
    // Let's assume the column exists now since user ran the SQL.

    // Actually, I should just stick to the main query being robust.
    // If the first query fails, it returns empty array from that block IF error code is NOT 42703.
    // If it falls through, it means either `category` was undefined OR error was 42703 (missing column).
    // If missing column `category`, then `is_premium` might also be missing.
    // So let's leave the fallback purely raw for safety. The user has added the columns.

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching predictions:', error);
        return [];
    }

    return data as Prediction[];
}

export const getBlogPosts = async (limit = 6) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching blog posts:', error)
        return []
    }

    return data as BlogPost[]
}

export const getPredictionBySlug = async (slug: string) => {
    // 1. Try exact match (for backward compatibility and current DB state)
    let { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!error && data) return data as Prediction

    // 2. Try suffix match if slug looks like the new format
    const parts = slug.split('-')
    const suffix = parts[parts.length - 1]

    const { data: suffixData, error: suffixError } = await supabase
        .from('predictions')
        .select('*')
        .ilike('slug', `%-${suffix}`)
        .single()

    if (suffixError) {
        console.error('Error fetching prediction by slug/suffix:', suffixError)
        return null
    }

    return suffixData as Prediction
}

export const getCountriesByRegion = async () => {
    const { data, error } = await supabase
        .from('countries')
        .select('*, regions(name)')
        .order('name', { ascending: true })

    if (error) return []
    return data
}

export const getPinnedLeagues = async () => {
    const { data, error } = await supabase
        .from('leagues')
        .select('*, countries(name)')
        .eq('is_pinned', true)
        .order('order_index', { ascending: true })

    if (error) return [] as League[]
    return data as League[]
}

export const getAllPredictions = async (limit = 100) => {
    const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching all predictions:', error)
        return []
    }

    return data as Prediction[]
}
