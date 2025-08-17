#!/usr/bin/env tsx

import { config } from 'dotenv';
import { Pool } from 'pg';

config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL missing');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const dupes = await pool.query(
      'SELECT title, COUNT(*) AS cnt FROM type_user GROUP BY title HAVING COUNT(*) > 1'
    );
    const all = await pool.query('SELECT id, title FROM type_user ORDER BY id');

    console.log('Current type_user rows:');
    console.table(all.rows);
    if (dupes.rowCount === 0) {
      console.log('No duplicate titles found in type_user.');
    } else {
      console.log('Duplicate titles:');
      console.table(dupes.rows);
    }
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


