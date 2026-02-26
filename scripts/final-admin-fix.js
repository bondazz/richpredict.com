const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xacflkmlqvifsxwysofm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2Zsa21scXZpZnN4d3lzb2ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQxMzYyOSwiZXhwIjoyMDg2OTg5NjI5fQ.l5dNjlJV7WKjbbdz1ssK_SI8T5pUyMi2u6Eia4VI2QQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAndFixAdmin() {
    console.log('--- Database Verification Start ---');

    // 1. Fetch the user manually
    const { data: user, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', 'info@richpredict.com')
        .single();

    if (fetchError) {
        console.log('User info@richpredict.com NOT FOUND or fetch error:', fetchError.message);
        console.log('Creating fresh user...');
        const { error: insErr } = await supabase.from('admins').insert([{
            email: 'info@richpredict.com',
            password_hash: 'Samir_1155!'
        }]);
        if (insErr) console.error('Creation failed:', insErr);
        else console.log('Successfully created fresh user.');
    } else {
        console.log('User found. Current data:', JSON.stringify(user));

        // Correcting if password_hash is wrong
        if (user.password_hash !== 'Samir_1155!') {
            console.log('Password mismatch in DB. Updating to Samir_1155!...');
            const { error: updErr } = await supabase
                .from('admins')
                .update({ password_hash: 'Samir_1155!' })
                .eq('email', 'info@richpredict.com');
            if (updErr) console.error('Update failed:', updErr);
            else console.log('Successfully updated password in DB.');
        } else {
            console.log('DB already contains correct password_hash.');
        }
    }

    console.log('--- Verification Done ---');
}

verifyAndFixAdmin();
