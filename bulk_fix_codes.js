require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const countryMap = {
    'Turkey': 'tr',
    'Azerbaijan': 'az',
    'Spain': 'es',
    'Italy': 'it',
    'France': 'fr',
    'Brazil': 'br',
    'Argentina': 'ar',
    'Netherlands': 'nl',
    'Portugal': 'pt',
    'Belgium': 'be',
    'Austria': 'at',
    'Russia': 'ru',
    'Ukraine': 'ua',
    'Poland': 'pl',
    'Denmark': 'dk',
    'Norway': 'no',
    'Sweden': 'se',
    'Switzerland': 'ch',
    'Greece': 'gr',
    'Turkey': 'tr',
    'Czech Republic': 'cz',
    'Croatia': 'hr',
    'Scotland': 'gb-sct',
    'Wales': 'gb-wls',
    'Ireland': 'ie',
    'USA': 'us',
    'Mexico': 'mx',
    'Japan': 'jp',
    'South Korea': 'kr',
    'China': 'cn',
    'Australia': 'au',
    'Saudi Arabia': 'sa',
    'Morocco': 'ma',
    'Egypt': 'eg',
    'Nigeria': 'ng',
    'Senegal': 'sn',
    'Cameroon': 'cm',
    'Ghana': 'gh',
    'Ivory Coast': 'ci',
    'Algeria': 'dz',
    'Tunisia': 'tn',
    'Israel': 'il',
    'Bulgaria': 'bg',
    'Romania': 'ro',
    'Hungary': 'hu',
    'Serbia': 'rs',
    'Slovakia': 'sk',
    'Slovenia': 'si',
    'Finland': 'fi',
    'Iceland': 'is'
};

async function bulkFixCodes() {
    console.log('--- Bulk Fixing Country Codes ---');

    for (const [name, code] of Object.entries(countryMap)) {
        const { error } = await supabase
            .from('countries')
            .update({ code })
            .ilike('name', name);

        if (error) console.error(`Error for ${name}:`, error.message);
        else console.log(`✅ ${name} -> ${code}`);
    }
}

bulkFixCodes();
