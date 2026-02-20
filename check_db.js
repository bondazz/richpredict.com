const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://xacflkmlqvifsxwysofm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2Zsa21scXZpZnN4d3lzb2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTM2MjksImV4cCI6MjA4Njk4OTYyOX0.pCbZP4s9wEu-PBrDj03CF39QBxGbd6tHlB36ZGxKM0I');

async function check() {
    const { data, error } = await supabase.from('predictions').select('*').limit(1);
    if (error) {
        console.error(error);
        return;
    }
    if (data && data.length > 0) {
        console.log(Object.keys(data[0]));
    } else {
        console.log("No data found");
    }
}

check();
