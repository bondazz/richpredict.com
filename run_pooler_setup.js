const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = {
    user: 'postgres.xacflkmlqvifsxwysofm',
    password: 'Samir_1155!',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: true
};

async function runSetup() {
    console.log('Connecting to database via pooler...');
    const client = new Client(config);

    try {
        await client.connect();

        console.log('Reading SQL file...');
        const sqlPath = path.join(__dirname, 'setup_premium_db.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL...');
        const res = await client.query(sql);

        console.log('SQL executed successfully!');
    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

runSetup();
