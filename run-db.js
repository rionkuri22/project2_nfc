import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    await client.connect();
    console.log("Adding context_message column...");
    await client.query('ALTER TABLE settings ADD COLUMN IF NOT EXISTS context_message TEXT DEFAULT NULL');
    console.log("Done.");
    await client.end();
}
main();
