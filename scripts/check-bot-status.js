const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRecentPredictions() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log(`Checking predictions for ${today} and ${tomorrow}...`);

    const { data: todayMatches, error: err1 } = await supabase
        .from('predictions')
        .select('id, home_team, away_team, match_date, created_at')
        .eq('match_date', today);

    const { data: tomorrowMatches, error: err2 } = await supabase
        .from('predictions')
        .select('id, home_team, away_team, match_date, created_at')
        .eq('match_date', tomorrow);

    if (err1) console.error('Error fetching today:', err1.message);
    if (err2) console.error('Error fetching tomorrow:', err2.message);

    console.log(`Today (${today}): ${todayMatches ? todayMatches.length : 0} matches`);
    if (todayMatches && todayMatches.length > 0) {
        console.log('Sample match:', todayMatches[0].home_team, 'vs', todayMatches[0].away_team);
    }

    console.log(`Tomorrow (${tomorrow}): ${tomorrowMatches ? tomorrowMatches.length : 0} matches`);
    if (tomorrowMatches && tomorrowMatches.length > 0) {
        console.log('Sample match:', tomorrowMatches[0].home_team, 'vs', tomorrowMatches[0].away_team);
    }
}

checkRecentPredictions();
