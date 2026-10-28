import { paths } from '../src/config/paths.js';
import { createPgliteDb } from '../src/database/pglite.js';
import { migrate } from '../src/database/migrate.js';
import { createApp } from '../src/app.js';
import { createContainer, type ContainerOptions } from '../src/container.js';

export const TEST_PASSWORD = 'senha-de-teste-123';

export async function makeTestApp(overrides: Partial<Omit<ContainerOptions, 'db' | 'env'>> & { staticDir?: string } = {}) {
  const db = await createPgliteDb();
  await migrate(db, paths.sqlDir);
  const container = createContainer({
    db,
    env: {
      NODE_ENV: 'test',
      ADMIN_PASSWORD: TEST_PASSWORD,
      SESSION_SECRET: 'segredo-de-teste-com-mais-de-32-caracteres',
      STATUS_TIMEOUT_MS: 200,
      STATUS_CACHE_SECONDS: 300,
    },
    projects: [],
    ...overrides,
  });
  const app = createApp(container, { staticDir: overrides.staticDir });
  return { app, db, container };
}

export const validContact = {
  name: 'Ana Recrutadora',
  email: 'Ana@Empresa.com.br',
  company: 'Empresa X',
  message: 'Olá Bruno, gostaria de conversar sobre uma vaga de back-end.',
  consent: true,
};
