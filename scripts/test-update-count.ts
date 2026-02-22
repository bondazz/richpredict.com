import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function reproduceIssue() {
    const id = '54640796-0343-49e4-9925-ad40172a21a2'
    const newVal = 55;

    console.log(`Attempting to update dist_home to ${newVal} for ID: ${id}`)

    const { data, error, status, statusText } = await supabase
        .from('predictions')
        .update({ dist_home: newVal })
        .eq('id', id)
        .select()

    console.log('Status:', status, statusText)
    if (error) {
        console.error('Error:', error.message)
    } else {
        console.log('Updated Data:', data)
        if (data?.length === 0) {
            console.log('No rows were updated! Check if ID exists or RLS.')
        } else {
            console.log('Update confirmed in response.')
        }
    }
}

reproduceIssue()
