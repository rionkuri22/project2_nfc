import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    console.log("Creating table...");
    await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      active_platform VARCHAR(50) NOT NULL
    );
  `);

    const res = await pool.query('SELECT COUNT(*) FROM settings');
    if (parseInt(res.rows[0].count) === 0) {
        await pool.query("INSERT INTO settings (active_platform) VALUES ('instagram')");
        console.log("Inserted default row 'instagram'");
    }

    console.log("Database initialized");
    await pool.end();
}

main().catch(console.error);
