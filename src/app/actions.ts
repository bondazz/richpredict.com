'use server'

import { supabase } from '@/lib/supabase'
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

    const { error } = await supabase
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

    const { error } = await supabase
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
