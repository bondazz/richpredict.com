const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addLeagueIdColumn() {
    console.log('NOTICE: You must run the following SQL in the Supabase Dashboard SQL Editor:');
    console.log(`
    ALTER TABLE teams ADD COLUMN IF NOT EXISTS league_id UUID REFERENCES leagues(id);
    `);

    // We can't run ALTER TABLE via the JS client, but we can verify if we can see it after local change.
    console.log('Please execute the SQL above and then let me know.');
}

addLeagueIdColumn();
