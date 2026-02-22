import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testFullUpdate() {
    console.log('--- Testing Full Match Update ---')
    const { data: match } = await supabase
        .from('predictions')
        .select('*')
        .ilike('slug', `%442%`)
        .limit(1)
        .single()

    if (!match) return

    const updates = {
        home_team: match.home_team,
        away_team: match.away_team,
        prediction: match.prediction,
        odds: match.odds,
        match_date: match.match_date,
        match_time: match.match_time,
        status: match.status,
        result: match.result,
        dist_home: 48,
        dist_draw: 22,
        dist_away: 30
    }

    console.log('Updating with:', updates)

    const { error } = await supabase
        .from('predictions')
        .update(updates)
        .eq('id', match.id)

    if (error) {
        console.error('Update Failed:', error.message)
        console.error('Details:', error.details)
    } else {
        console.log('Full Update Successful!')
    }
}

testFullUpdate()
