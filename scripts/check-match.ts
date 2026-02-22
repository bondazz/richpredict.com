import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkMatch() {
    console.log('--- Checking Match by Slug ---')
    const slug = 'manchester-united-vs-liverpool-predictions-betting-tips-match-previews-442'
    const { data: match, error } = await supabase
        .from('predictions')
        .select('*')
        .ilike('slug', `%442%`)
        .limit(1)
        .single()

    if (error) {
        console.error('Error finding match:', error.message)
        return
    }

    console.log('Match Found:')
    console.log('ID:', match.id, '(Type:', typeof match.id, ')')
    console.log('Home:', match.home_team)
    console.log('Away:', match.away_team)
    console.log('Date:', match.match_date)
    console.log('Time:', match.match_time)
    console.log('Dist:', match.dist_home, match.dist_draw, match.dist_away)

    console.log('\n--- Attempting Update via Script ---')
    const { error: updateError } = await supabase
        .from('predictions')
        .update({
            dist_home: 49,
            dist_draw: 21,
            dist_away: 30
        })
        .eq('id', match.id)

    if (updateError) {
        console.error('Update Failed:', updateError.message)
    } else {
        console.log('Update Successful in script!')
    }
}

checkMatch()
