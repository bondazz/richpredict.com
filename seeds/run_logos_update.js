const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = {
    user: 'postgres.xacflkmlqvifsxwysofm',
    password: 'Samir_1155!',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
};

async function runSetup() {
    console.log('🚀 Connecting to database via pooler...');
    const client = new Client(config);

    try {
        await client.connect();

        console.log('📖 Reading add_logos_to_predictions_schema.sql...');
        const sqlPath = path.join(__dirname, 'add_logos_to_predictions_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('⚙️ Executing SQL to add columns and backfill logos...');
        const res = await client.query(sql);

        console.log('✅ SQL executed successfully!');
    } catch (err) {
        console.error('❌ Error executing SQL:', err);
    } finally {
        await client.end();
        console.log('🔌 Connection closed.');
    }
}

runSetup();
