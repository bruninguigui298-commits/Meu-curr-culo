import type { Db } from './db.js';

/** Banco Postgres em memória (WASM) para testes e para `npm run dev:demo`. */
export async function createPgliteDb(): Promise<Db> {
  const { PGlite } = await import('@electric-sql/pglite');
  const lite = new PGlite();
  return {
    async query(sql, params = []) {
      const res = await lite.query(sql, params);
      return { rows: res.rows as never[] };
    },
    async exec(sql) {
      await lite.exec(sql);
    },
    async close() {
      await lite.close();
    },
  };
}
