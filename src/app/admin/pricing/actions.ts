'use server'

import { updateSiteSettings, getSiteSettings } from '@/lib/settings'
import { revalidatePath } from 'next/cache'

export async function savePricingPlans(plans: any[]) {
    await updateSiteSettings('pricing_plans', plans)
    revalidatePath('/')
    revalidatePath('/admin/pricing')
}

export async function fetchPricingPlans() {
    return await getSiteSettings('pricing_plans')
}
