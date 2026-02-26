const { Client } = require('pg');
const connectionString = "postgresql://postgres.xacflkmlqvifsxwysofm:Samir_1155!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString });

const sql = `
CREATE TABLE IF NOT EXISTS google_indexing_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    url text NOT NULL UNIQUE,
    status text NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
`;

client.connect()
    .then(() => client.query(sql))
    .then(() => console.log('Table created successfully'))
    .catch(e => console.error('Error creating table:', e))
    .finally(() => client.end());
