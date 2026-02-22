import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function reproduceIssue() {
    const id = '54640796-0343-49e4-9925-ad40172a21a2'
    const data = {
        dist_home: "50", // simulate string from formData
        dist_draw: "20",
        dist_away: "30"
    }

    console.log('Testing update with string values on ID:', id)

    const { error } = await supabase
        .from('predictions')
        .update({
            ...data,
            dist_home: parseInt(data.dist_home as any) || 0,
            dist_draw: parseInt(data.dist_draw as any) || 0,
            dist_away: parseInt(data.dist_away as any) || 0,
        })
        .eq('id', id)

    if (error) {
        console.error('FAILED:', error.message)
    } else {
        console.log('SUCCESS!')
        // Verify
        const { data: ver } = await supabase.from('predictions').select('dist_home').eq('id', id).single()
        console.log('Verified value:', ver.dist_home)
    }
}

reproduceIssue()
