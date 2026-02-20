const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Connection string
const connectionString = 'postgresql://postgres:Samir_1155!@db.xacflkmlqvifsxwysofm.supabase.co:5432/postgres';

async function runSetup() {
    console.log('Connecting to database...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log('Reading SQL file...');
        const sqlPath = path.join(__dirname, 'setup_premium_db.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL...');
        const res = await client.query(sql);

        console.log('SQL executed successfully!', res);
    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

runSetup();
