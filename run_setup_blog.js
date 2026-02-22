const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Using the same connection string from the user's existing setup script
const connectionString = 'postgresql://postgres:Samir_1155!@db.xacflkmlqvifsxwysofm.supabase.co:5432/postgres';

async function runSetup() {
    console.log('Connecting to database...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log('Reading setup_blog_table.sql...');
        const sqlPath = path.join(__dirname, 'setup_blog_table.sql');
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`SQL file not found at ${sqlPath}`);
        }
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL to create blog_posts table...');
        const res = await client.query(sql);

        console.log('Table created successfully!');
    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

runSetup();
