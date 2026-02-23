require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCountries() {
    const { data, error } = await supabase
        .from('countries')
        .select('name, code, flag_url')
        .in('name', ['Germany', 'England', 'United Kingdom']);

    if (error) {
        console.error('Error fetching countries:', error);
        return;
    }

    console.log('--- Country Data ---');
    console.log(JSON.stringify(data, null, 2));
}

checkCountries();
