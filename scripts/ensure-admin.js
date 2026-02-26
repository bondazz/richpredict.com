const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xacflkmlqvifsxwysofm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2Zsa21scXZpZnN4d3lzb2ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQxMzYyOSwiZXhwIjoyMDg2OTg5NjI5fQ.l5dNjlJV7WKjbbdz1ssK_SI8T5pUyMi2u6Eia4VI2QQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
    console.log('Checking/Creating admins table...');

    // Check if table exists (simple query)
    const { error: tableError } = await supabase.from('admins').select('id').limit(1);

    if (tableError && tableError.code === '42P01') { // Table does not exist
        console.log('Admins table missing. Please run the SQL setup to create it.');
        // Note: I cannot run raw SQL CREATE TABLE via supabase-js easily unless I use the REST API for SQL which is usually disabled.
        // But I can try to insert and see.
    }

    console.log('Ensuring info@richpredict.com exists...');
    const { data: existing, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', 'info@richpredict.com')
        .single();

    if (fetchError && fetchError.code === 'PGRST116') { // Not found
        console.log('User not found, creating...');
        const { error: insertError } = await supabase
            .from('admins')
            .insert([{
                email: 'info@richpredict.com',
                password: 'admin123',
                role: 'admin'
            }]);

        if (insertError) console.error('Error creating admin:', insertError);
        else console.log('Successfully created info@richpredict.com');
    } else if (existing) {
        console.log('Admin already exists.');
    } else {
        console.error('Fetch error:', fetchError);
    }
}

setupAdmin();
