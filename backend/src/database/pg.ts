import pg from 'pg';
import type { Db } from './db.js';

export function createPgDb(connectionString: string): Db {
  const needsSsl = !/localhost|127\.0\.0\.1/.test(connectionString);
  const pool = new pg.Pool({
    connectionString,
    max: 5,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
  return {
    async query(sql, params = []) {
      const res = await pool.query(sql, params);
      return { rows: res.rows };
    },
    async exec(sql) {
      await pool.query(sql);
    },
    async close() {
      await pool.end();
    },
  };
}
