import { loadEnv } from './config/env.js';
import { paths } from './config/paths.js';
import type { Db } from './database/db.js';
import { migrate } from './database/migrate.js';
import { createApp } from './app.js';
import { createContainer } from './container.js';

async function main() {
  const env = loadEnv();
  let db: Db;
  if (env.DEMO) {
    const { createPgliteDb } = await import('./database/pglite.js');
    db = await createPgliteDb();
    console.log('[demo] usando PGlite em memória — nada é salvo ao reiniciar.');
  } else {
    const { createPgDb } = await import('./database/pg.js');
    db = createPgDb(env.DATABASE_URL!);
  }
  const applied = await migrate(db, paths.sqlDir);
  if (applied.length) console.log('[db] migrações aplicadas:', applied.join(', '));

  const container = createContainer({ db, env });
  if (env.DEMO) await seedDemo(container);

  // Retenção: apaga mensagens antigas na subida e uma vez por dia.
  const purge = () => container.services.contact.purgeExpired().catch((e) => console.error('[retencao]', e));
  void purge();
  setInterval(purge, 24 * 60 * 60 * 1000).unref();

  const app = createApp(container, { staticDir: paths.frontendDist });
  const server = app.listen(env.PORT, () => {
    console.log(`[api] ouvindo em http://localhost:${env.PORT}`);
    if (env.DEMO) console.log(`[demo] admin: http://localhost:${env.PORT}/admin  (senha: ${env.ADMIN_PASSWORD})`);
  });

  const shutdown = () => {
    server.close(() => void db.close().finally(() => process.exit(0)));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

async function seedDemo(c: ReturnType<typeof createContainer>) {
  await c.services.contact.send({
    name: 'Pessoa de exemplo (demo)',
    email: 'exemplo@example.com',
    message: 'Mensagem de demonstração criada pelo modo dev:demo. Não é um contato real.',
    consent: true,
  });
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
