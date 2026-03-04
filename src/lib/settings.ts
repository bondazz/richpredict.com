import { supabaseAdmin } from '@/lib/supabase'

export async function getSiteSettings(id: string) {
    const { data, error } = await supabaseAdmin
        .from('site_settings')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error(`Error fetching site setting ${id}:`, error)
        return null
    }
    return data.value
}

export async function updateSiteSettings(id: string, value: any) {
    const { error } = await supabaseAdmin
        .from('site_settings')
        .upsert({ id, value, updated_at: new Date().toISOString() })

    if (error) {
        console.error(`Error updating site setting ${id}:`, error)
        throw new Error(`Failed to update ${id}`)
    }
}
