import { getPredictionBySlug } from '../src/lib/supabase';

async function test() {
    const slug = 'everton-vs-manchester-utd-predictions-match-insight-tips'; // Example from screenshot
    console.log('Fetching prediction for slug:', slug);
    const match = await getPredictionBySlug(slug);

    if (match) {
        console.log('Match found!');
        console.log('League:', match.league);
        console.log('Leagues data:', JSON.stringify(match.leagues, null, 2));
    } else {
        console.log('Match not found.');
    }
}

test();
