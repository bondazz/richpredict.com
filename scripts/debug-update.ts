import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugUpdate() {
    // Try to update a sample prediction (adjust ID if needed)
    const { data: samples } = await supabase.from('predictions').select('id').limit(1)
    if (!samples || samples.length === 0) {
        console.log('No predictions found to test update.')
        return
    }

    const testId = samples[0].id
    console.log('Testing update for ID:', testId)

    const { error } = await supabase
        .from('predictions')
        .update({
            dist_home: 50,
            dist_draw: 20,
            dist_away: 30
        })
        .eq('id', testId)

    if (error) {
        console.error('Update FAILED with error:', error.message)
        console.error('Error Code:', error.code)
        console.error('Error Details:', error.details)
        console.error('Error Hint:', error.hint)
    } else {
        console.log('Update SUCCESSFUL. Columns exist.')
    }
}

debugUpdate()
