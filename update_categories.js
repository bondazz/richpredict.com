const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xacflkmlqvifsxwysofm.supabase.co';
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQxMzYyOSwiZXhwIjoyMDg2OTg5NjI5fQ.l5dNjlJV7WKjbbdz1ssK_SI8T5pUyMi2u6Eia4VI2QQ';

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function setDefaults() {
    console.log("Setting default category to 'Football' for all predictions...");
    const { data, error } = await supabase
        .from('predictions')
        .update({ category: 'Football' })
        .is('category', null);

    if (error) {
        console.error("Error updating categories:", error);
    } else {
        console.log("Successfully updated categories.");
    }
}

setDefaults();
