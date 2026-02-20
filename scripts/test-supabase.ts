import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugDatabase() {
    console.log('--- DEBUG START ---')
    console.log('Connecting to:', supabaseUrl)

    // 1. Test Predictions
    console.log('\n[1] Testing "predictions" table...')
    const { data: preds, error: predErr, count: predCount } = await supabase
        .from('predictions')
        .select('*', { count: 'exact' })

    if (predErr) console.error('  ❌ Error:', predErr.message)
    else console.log(`  ✅ Found ${preds?.length || 0} rows. (Total count: ${predCount})`)

    // 2. Test Regions
    console.log('\n[2] Testing "regions" table...')
    const { data: regions, error: regErr } = await supabase.from('regions').select('*')
    if (regErr) console.error('  ❌ Error:', regErr.message)
    else console.log(`  ✅ Found ${regions?.length || 0} rows.`)

    // 3. Test Countries
    console.log('\n[3] Testing "countries" table...')
    const { data: countries, error: countErr } = await supabase.from('countries').select('*')
    if (countErr) console.error('  ❌ Error:', countErr.message)
    else console.log(`  ✅ Found ${countries?.length || 0} rows.`)

    // 4. Test Leagues
    console.log('\n[4] Testing "leagues" table...')
    const { data: leagues, error: leagueErr } = await supabase.from('leagues').select('*')
    if (leagueErr) console.error('  ❌ Error:', leagueErr.message)
    else console.log(`  ✅ Found ${leagues?.length || 0} rows.`)

    // 5. Test Relational Query (Sidebar logic)
    console.log('\n[5] Testing Countries with Regions (Sidebar Join)...')
    const { data: sideData, error: sideErr } = await supabase
        .from('countries')
        .select('*, regions(name)')

    if (sideErr) {
        console.error('  ❌ Relational Error:', sideErr.message)
        console.log('  Hint: Check if the relationship (foreign key) is correctly defined.')
    } else {
        console.log(`  ✅ Join successful. Found ${sideData?.length || 0} joined rows.`)
        if (sideData && sideData.length > 0) {
            console.log('  Sample:', JSON.stringify(sideData[0], null, 2))
        }
    }

    console.log('\n--- DEBUG END ---')
}

debugDatabase()
