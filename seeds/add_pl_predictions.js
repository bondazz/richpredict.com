const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generatePredictions() {
    // 1. Get Premier League ID
    const { data: leagueData } = await supabase
        .from('leagues')
        .select('id')
        .eq('name', 'Premier League')
        .single();

    if (!leagueData) {
        console.error('Premier League not found');
        return;
    }

    const leagueId = leagueData.id;

    const matches = [
        { home: 'Aston Villa', away: 'Leeds', date: '2026-02-21', time: '19:00', pred: 'Home Win', odds: 1.65, confidence: '85%', premium: false },
        { home: 'Brentford', away: 'Brighton', date: '2026-02-21', time: '19:00', pred: 'Over 2.5 Goals', odds: 1.80, confidence: '78%', premium: false },
        { home: 'Chelsea', away: 'Burnley', date: '2026-02-21', time: '19:00', pred: 'Home Win', odds: 1.45, confidence: '90%', premium: true },
        { home: 'West Ham', away: 'Bournemouth', date: '2026-02-21', time: '21:30', pred: 'Home Win', odds: 1.95, confidence: '75%', premium: false },
        { home: 'Manchester City', away: 'Newcastle', date: '2026-02-22', time: '00:00', pred: 'Home Win', odds: 1.35, confidence: '92%', premium: true },
        { home: 'Crystal Palace', away: 'Wolves', date: '2026-02-22', time: '18:00', pred: 'Under 2.5 Goals', odds: 1.70, confidence: '82%', premium: false },
        { home: 'Nottingham', away: 'Liverpool', date: '2026-02-22', time: '18:00', pred: 'Away Win', odds: 1.55, confidence: '88%', premium: true },
        { home: 'Sunderland', away: 'Fulham', date: '2026-02-22', time: '18:00', pred: 'Away Win', odds: 2.15, confidence: '70%', premium: false },
        { home: 'Tottenham', away: 'Arsenal', date: '2026-02-22', time: '20:30', pred: 'Both Teams to Score', odds: 1.60, confidence: '85%', premium: true },
        { home: 'Everton', away: 'Manchester Utd', date: '2026-02-24', time: '00:00', pred: 'Away Win', odds: 2.10, confidence: '72%', premium: false }
    ];

    for (const m of matches) {
        const slug = `${m.home.toLowerCase().replace(/ /g, '-')}-vs-${m.away.toLowerCase().replace(/ /g, '-')}-${m.date}`;

        console.log(`Inserting: ${m.home} vs ${m.away}...`);

        const { error } = await supabase
            .from('predictions')
            .upsert({
                home_team: m.home,
                away_team: m.away,
                prediction: m.pred,
                odds: m.odds,
                match_date: m.date,
                match_time: m.time,
                league: 'Premier League',
                league_id: leagueId,
                category: 'Football',
                status: 'pending',
                confidence: m.confidence,
                slug: slug,
                is_premium: m.premium,
                analysis: `Analysis for ${m.home} vs ${m.away}. Both teams are in good form, but ${m.home} has a slight advantage at home.`
            }, { onConflict: 'slug' });

        if (error) console.error(`Error inserting ${m.home}:`, error.message);
    }

    console.log('✅ All predictions inserted.');
}

generatePredictions();
