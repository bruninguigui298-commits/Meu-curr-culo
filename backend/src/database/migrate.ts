import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Db } from './db.js';

/** Aplica, em ordem, os arquivos .sql de `database/` que ainda não rodaram. */
export async function migrate(db: Db, sqlDir: string): Promise<string[]> {
  await db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name VARCHAR(200) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  const files = (await readdir(sqlDir)).filter((f) => f.endsWith('.sql')).sort();
  const { rows } = await db.query<{ name: string }>('SELECT name FROM schema_migrations');
  const done = new Set(rows.map((r) => r.name));
  const applied: string[] = [];
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(path.join(sqlDir, file), 'utf8');
    await db.exec(sql);
    await db.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
    applied.push(file);
  }
  return applied;
}
