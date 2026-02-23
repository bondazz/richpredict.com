require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixCountries() {
    console.log('--- Fixing Countries ---');

    // Fix Germany
    const { error: err1 } = await supabase
        .from('countries')
        .update({ code: 'de' })
        .eq('name', 'Germany');
    if (err1) console.error('Error fixing Germany:', err1);
    else console.log('✅ Germany code set to "de"');

    // Fix England - flag-icons uses 'gb-eng' usually, but our component splits it.
    // Let's modify the component to NOT split if it's a known subdivision or just not split at all if we trust our codes.
    // Actually, England often uses 'gb-eng' in flag-icons.

    // Let's check what codes we have
    const { data: allCountries } = await supabase.from('countries').select('name, code');
    const missingCodes = allCountries.filter(c => !c.code);
    console.log(`Countries without codes: ${missingCodes.length}`);
    if (missingCodes.length > 0) {
        console.log('Sample missing:', missingCodes.slice(0, 10).map(c => c.name).join(', '));
    }
}

fixCountries();
