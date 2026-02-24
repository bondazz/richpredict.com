const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCreationTime() {
    const { data: recent, error } = await supabase
        .from('predictions')
        .select('id, home_team, away_team, match_date, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) console.error(error);
    else {
        console.log('Most recently created predictions:');
        recent.forEach(m => {
            console.log(`- ${m.home_team} vs ${m.away_team} | Date: ${m.match_date} | Created: ${m.created_at}`);
        });
    }
}

checkCreationTime();
