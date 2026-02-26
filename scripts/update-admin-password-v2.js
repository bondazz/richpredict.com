const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xacflkmlqvifsxwysofm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2Zsa21scXZpZnN4d3lzb2ZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQxMzYyOSwiZXhwIjoyMDg2OTg5NjI5fQ.l5dNjlJV7WKjbbdz1ssK_SI8T5pUyMi2u6Eia4VI2QQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updatePassword() {
    console.log('Updating password for info@richpredict.com using password_hash column...');

    const { data: existing, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', 'info@richpredict.com')
        .single();

    if (existing) {
        console.log('Found user, updating password_hash to Samir_1155!...');
        const { error: updateError } = await supabase
            .from('admins')
            .update({ password_hash: 'Samir_1155!' })
            .eq('email', 'info@richpredict.com');

        if (updateError) console.error('Error updating password:', updateError);
        else console.log('Successfully updated password_hash for info@richpredict.com');
    } else {
        console.log('User not found, creating with password_hash Samir_1155!...');
        const { error: insertError } = await supabase
            .from('admins')
            .insert([{
                email: 'info@richpredict.com',
                password_hash: 'Samir_1155!'
            }]);

        if (insertError) console.error('Error creating admin:', insertError);
        else console.log('Successfully created info@richpredict.com');
    }
}

updatePassword();
