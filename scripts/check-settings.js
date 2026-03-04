const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (error) {
            console.error('Table check error:', error.message);
            if (error.message.includes('relation "site_settings" does not exist')) {
                console.log('--- ACTION REQUIRED: Table site_settings does NOT exist. ---');
            }
        } else {
            console.log('Table site_settings exists. Data found:', data.length);
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('Script error:', e.message);
    }
}

check();
