const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xacflkmlqvifsxwysofm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2Zsa21scXZpZnN4d3lzb2ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQxMzYyOSwiZXhwIjoyMDg2OTg5NjI5fQ.l5dNjlJV7WKjbbdz1ssK_SI8T5pUyMi2u6Eia4VI2QQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testQuery() {
    console.log('Testing raw query logic...');
    const email = 'info@richpredict.com';
    const password = 'Samir_1155!';

    const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

    if (error) {
        console.log('Query ERROR:', error.message);
    } else {
        console.log('Query SUCCESS. Data found:', !!data);
        if (data) console.log('Email match:', data.email === email);
        if (data) console.log('Pass match:', data.password_hash === password);
    }
}

testQuery();
