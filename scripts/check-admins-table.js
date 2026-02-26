const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xacflkmlqvifsxwysofm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2Zsa21scXZpZnN4d3lzb2ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQxMzYyOSwiZXhwIjoyMDg2OTg5NjI5fQ.l5dNjlJV7WKjbbdz1ssK_SI8T5pUyMi2u6Eia4VI2QQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTable() {
    console.log('Checking admins table structure...');
    const { data, error } = await supabase.from('admins').select('*').limit(1);

    if (error) {
        console.error('Error fetching from admins:', error);
    } else if (data && data.length > 0) {
        console.log('Available columns:', Object.keys(data[0]));
    } else {
        console.log('No data in admins table.');
        // Try to insert a dummy to see if it works or fails with missing column
        const { error: insertError } = await supabase.from('admins').insert([{ email: 'test@test.com' }]);
        if (insertError) console.error('Insert error:', insertError);
    }
}

checkTable();
