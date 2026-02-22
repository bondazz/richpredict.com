const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the project root
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for admin tasks

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const teamsFromHTML = [
    { name: 'Arsenal', logo: 'https://static.flashscore.com/res/image/data/0n1ffK6k-vcNAdtF9.png' },
    { name: 'Manchester City', logo: 'https://static.flashscore.com/res/image/data/0vgscFU0-lQuhqN8N.png' },
    { name: 'Aston Villa', logo: 'https://static.flashscore.com/res/image/data/UHchCEVH-UTYC4Dd6.png' },
    { name: 'Manchester Utd', logo: 'https://static.flashscore.com/res/image/data/GhGV3qjT-UPrTWfIe.png' },
    { name: 'Chelsea', logo: 'https://static.flashscore.com/res/image/data/lMxEQ8me-IROrZEJb.png' },
    { name: 'Liverpool', logo: 'https://static.flashscore.com/res/image/data/nBClzyne-f97XIGZs.png' },
    { name: 'Brentford', logo: 'https://static.flashscore.com/res/image/data/SjSCLv86-r9Mudk7j.png' },
    { name: 'Everton', logo: 'https://static.flashscore.com/res/image/data/EBfZuwme-bRmKmISE.png' },
    { name: 'Bournemouth', logo: 'https://static.flashscore.com/res/image/data/C60HMWTH-tCGtX12c.png' },
    { name: 'Newcastle', logo: 'https://static.flashscore.com/res/image/data/UXo7VXPq-ImMEe0UF.png' },
    { name: 'Sunderland', logo: 'https://static.flashscore.com/res/image/data/rPPdotBN-0d34NJCO.png' },
    { name: 'Fulham', logo: 'https://static.flashscore.com/res/image/data/fkbYUWme-ImMEe0UF.png' },
    { name: 'Crystal Palace', logo: 'https://static.flashscore.com/res/image/data/GfkvlLmC-drybTCiH.png' },
    { name: 'Brighton', logo: 'https://static.flashscore.com/res/image/data/G0q9xjRq-b92lfEJC.png' },
    { name: 'Leeds', logo: 'https://static.flashscore.com/res/image/data/lvs4WW5k-MTp25XgE.png' },
    { name: 'Tottenham', logo: 'https://static.flashscore.com/res/image/data/v3SzDxVH-Ig5FKJZ5.png' },
    { name: 'Nottingham', logo: 'https://static.flashscore.com/res/image/data/86ODdyle-ImKwLTtA.png' },
    { name: 'West Ham', logo: 'https://static.flashscore.com/res/image/data/YeSfKGlC-Q9DJHs4l.png' },
    { name: 'Burnley', logo: 'https://static.flashscore.com/res/image/data/xO3nES96-6PhTI7J6.png' },
    { name: 'Wolves', logo: 'https://static.flashscore.com/res/image/data/OMUzjDkC-CjV6Eptm.png' }
];

async function syncTeams() {
    console.log('🔍 Checking teams in England...');

    // 1. Get England country ID
    const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('id')
        .eq('name', 'England')
        .single();

    if (countryError || !countryData) {
        console.error('Could not find England in countries table.');
        return;
    }

    const englandId = countryData.id;

    // 2. Fetch existing teams for England
    const { data: existingTeams, error: teamsError } = await supabase
        .from('teams')
        .select('name, logo_url')
        .eq('country_id', englandId);

    if (teamsError) {
        console.error('Error fetching existing teams:', teamsError.message);
        return;
    }

    const existingNames = new Set(existingTeams.map(t => t.name));

    // 3. Process teams
    for (const team of teamsFromHTML) {
        if (existingNames.has(team.name)) {
            console.log(`♻️ Updating logo for ${team.name}...`);
            await supabase
                .from('teams')
                .update({ logo_url: team.logo })
                .eq('name', team.name)
                .eq('country_id', englandId);
        } else {
            console.log(`➕ Adding new team: ${team.name}...`);
            await supabase
                .from('teams')
                .insert({
                    name: team.name,
                    country_id: englandId,
                    logo_url: team.logo
                });
        }
    }

    console.log('🎯 Finalized Premier League team sync.');
}

syncTeams();
