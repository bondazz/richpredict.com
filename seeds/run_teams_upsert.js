const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Connection config from run_pooler_setup.js
const config = {
    user: 'postgres.xacflkmlqvifsxwysofm',
    password: 'Samir_1155!',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
};

async function runUpsert() {
    console.log('🚀 Connecting to Supabase database via pooler...');
    const client = new Client(config);

    try {
        await client.connect();

        console.log('📖 Reading premier_league_teams.sql...');
        const sqlPath = path.join(__dirname, 'premier_league_teams.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('⚙️ Executing upsert operations for 20 teams...');
        await client.query(sql);

        console.log('✅ Premier League teams and logos updated successfully!');
    } catch (err) {
        console.error('❌ Error executing SQL:', err);
    } finally {
        await client.end();
        console.log('🔌 Connection closed.');
    }
}

runUpsert();
