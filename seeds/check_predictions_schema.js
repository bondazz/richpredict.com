const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'predictions' });
    if (error) {
        // Fallback: try to select one row
        const { data: row, error: rowError } = await supabase.from('predictions').select('*').limit(1);
        if (rowError) {
            console.error('Error fetching schema:', rowError.message);
        } else {
            console.log('Columns in predictions table:', Object.keys(row[0] || {}));
        }
    } else {
        console.log('Columns:', data);
    }
}

checkSchema();
