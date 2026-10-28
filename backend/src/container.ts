import type { Env } from './config/env.js';
import type { Db } from './database/db.js';
import { MONITORED_PROJECTS, type MonitoredProject } from './domain/projects.js';
import { ContactRepository } from './repositories/contactRepository.js';
import { LgpdRepository } from './repositories/lgpdRepository.js';
import { AuthService } from './services/authService.js';
import { ContactService } from './services/contactService.js';
import { LgpdService } from './services/lgpdService.js';
import { RateLimiter } from './services/rateLimiter.js';
import { StatusService, type FetchFn } from './services/statusService.js';
import { AdminController } from './controllers/adminController.js';
import { ContactController } from './controllers/contactController.js';
import { LgpdController } from './controllers/lgpdController.js';
import { StatusController } from './controllers/statusController.js';

export interface ContainerOptions {
  db: Db;
  env: Pick<Env, 'NODE_ENV' | 'ADMIN_PASSWORD' | 'SESSION_SECRET' | 'STATUS_TIMEOUT_MS' | 'STATUS_CACHE_SECONDS'>;
  projects?: MonitoredProject[];
  fetchFn?: FetchFn;
  now?: () => number;
}

const MIN = 60 * 1000;

export function createContainer(opts: ContainerOptions) {
  const { db, env, now = Date.now } = opts;
  const repositories = {
    contact: new ContactRepository(db),
    lgpd: new LgpdRepository(db),
  };
  const services = {
    contact: new ContactService(repositories.contact),
    lgpd: new LgpdService(repositories.lgpd),
    status: new StatusService(
      opts.projects ?? MONITORED_PROJECTS,
      { timeoutMs: env.STATUS_TIMEOUT_MS, cacheSeconds: env.STATUS_CACHE_SECONDS },
      opts.fetchFn,
      now,
    ),
    auth: new AuthService(env.ADMIN_PASSWORD, env.SESSION_SECRET, now),
  };
  const limiters = {
    contact: new RateLimiter(3, 60 * MIN, now), // 3 mensagens por hora por IP
    lgpd: new RateLimiter(5, 60 * MIN, now),
    lookup: new RateLimiter(20, 15 * MIN, now),
    login: new RateLimiter(5, 15 * MIN, now),
  };
  const controllers = {
    contact: new ContactController(services.contact),
    lgpd: new LgpdController(services.lgpd),
    status: new StatusController(services.status),
    admin: new AdminController(services.auth, env.NODE_ENV === 'production'),
  };
  return { db, repositories, services, limiters, controllers };
}

export type Container = ReturnType<typeof createContainer>;
