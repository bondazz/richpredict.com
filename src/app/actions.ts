'use server'

import { supabase, supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function checkAdmin() {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')
    if (!session) {
        redirect('/admin/login')
    }
}

export async function deletePrediction(id: string | number) {
    await checkAdmin()

    const { error } = await supabaseAdmin
        .from('predictions')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting prediction:', error)
        throw new Error('Failed to delete prediction')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
}

export async function togglePremium(id: string | number, currentStatus: boolean) {
    await checkAdmin()

    const { error } = await supabaseAdmin
        .from('predictions')
        .update({ is_premium: !currentStatus })
        .eq('id', id)

    if (error) {
        console.error('Error toggling premium:', error)
        throw new Error('Failed to toggle premium status')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
}

export async function updateCountry(id: string, updates: any) {
    await checkAdmin()

    const { error } = await supabaseAdmin
        .from('countries')
        .update(updates)
        .eq('id', id)

    if (error) {
        console.error('Error updating country:', error)
        throw new Error('Failed to update country')
    }

    revalidatePath('/admin/countries')
    revalidatePath('/')
}

export async function createPrediction(data: any) {
    await checkAdmin()

    // Auto-generate slug if not provided
    if (!data.slug) {
        data.slug = `${data.home_team.toLowerCase().replace(/ /g, '-')}-vs-${data.away_team.toLowerCase().replace(/ /g, '-')}-${Date.now()}`;
    }

    const { error } = await supabaseAdmin
        .from('predictions')
        .insert({
            ...data,
            odds: parseFloat(data.odds) || 0,
            dist_home: parseInt(data.dist_home) || 0,
            dist_draw: parseInt(data.dist_draw) || 0,
            dist_away: parseInt(data.dist_away) || 0,
        })

    if (error) {
        console.error('Error creating prediction:', error)
        throw new Error('Failed to create prediction')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
    revalidatePath(`/predictions/${data.slug}`)
}

export async function updatePrediction(id: string | number, data: any) {
    await checkAdmin()

    const { error } = await supabaseAdmin
        .from('predictions')
        .update({
            ...data,
            odds: parseFloat(data.odds) || 0,
            dist_home: parseInt(data.dist_home) || 0,
            dist_draw: parseInt(data.dist_draw) || 0,
            dist_away: parseInt(data.dist_away) || 0,
        })
        .eq('id', id)

    if (error) {
        console.error('CRITICAL_UPDATE_ERROR:', error)
        throw new Error(`DATABASE_ERROR: ${error.message} - ${error.details || ''}`)
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')

    // Fetch current slug to revalidate specific page
    const { data: current } = await supabase.from('predictions').select('slug').eq('id', id).single()
    if (current?.slug) {
        revalidatePath(`/predictions/${current.slug}`)
    }
}
