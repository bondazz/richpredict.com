import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectPredictions() {
    const { data, error } = await supabase.from('predictions').select('*').limit(1)
    if (error) {
        console.error('Error:', error.message)
    } else if (data && data.length > 0) {
        console.log('Prediction columns:', Object.keys(data[0]))
    } else {
        console.log('No prediction data found to inspect columns.')
    }
}

inspectPredictions()
