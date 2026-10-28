import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { loadEnv } from '../src/config/env.js';
import { paths } from '../src/config/paths.js';
import { migrate } from '../src/database/migrate.js';
import { createPgliteDb } from '../src/database/pglite.js';
import { makeTestApp } from './helpers.js';

describe('app', () => {
  it('health e cabeçalhos de segurança', async () => {
    const { app } = await makeTestApp();
    const res = await request(app).get('/api/health');
    expect(res.body).toEqual({ ok: true });
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('rota de API inexistente → 404 em JSON', async () => {
    const { app } = await makeTestApp();
    const res = await request(app).get('/api/nada');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('nao_encontrado');
  });

  it('entrega o build do site e faz fallback de SPA', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'site-'));
    mkdirSync(path.join(dir, 'assets'));
    writeFileSync(path.join(dir, 'index.html'), '<!doctype html><title>Bruno</title>');
    writeFileSync(path.join(dir, 'assets', 'app.js'), 'console.log(1)');
    const { app } = await makeTestApp({ staticDir: dir });
    expect((await request(app).get('/projetos/mensalli')).text).toContain('<title>Bruno</title>');
    const asset = await request(app).get('/assets/app.js');
    expect(asset.headers['cache-control']).toContain('immutable');
    expect((await request(app).get('/assets/nao-existe.js')).status).toBe(404);
    expect((await request(app).get('/api/health')).body).toEqual({ ok: true });
  });

  it('migrações são idempotentes', async () => {
    const db = await createPgliteDb();
    expect(await migrate(db, paths.sqlDir)).toEqual(['001_schema.sql']);
    expect(await migrate(db, paths.sqlDir)).toEqual([]);
  });

  it('em produção exige senha e segredo fortes', () => {
    expect(() => loadEnv({ NODE_ENV: 'production', DATABASE_URL: 'postgres://x' })).toThrow(/ADMIN_PASSWORD/);
    expect(() => loadEnv({ DATABASE_URL: undefined })).toThrow(/DATABASE_URL/);
    expect(loadEnv({ DEMO: '1' }).DEMO).toBe(true);
  });
});
