import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { MonitoredProject } from '../src/domain/projects.js';
import { StatusService, type FetchFn } from '../src/services/statusService.js';
import { makeTestApp } from './helpers.js';

const projects: MonitoredProject[] = [
  { slug: 'a', name: 'A', url: 'https://a.test', healthPath: '/health' },
  { slug: 'b', name: 'B', url: 'https://b.test', healthPath: '/health' },
  { slug: 'c', name: 'C', url: 'https://c.test', healthPath: '/health' },
  { slug: 'd', name: 'D', url: 'https://d.test', healthPath: '/health' },
];

/** a: responde /health; b: sem /health (404) mas a home responde; c: nunca responde; d: erro 503. */
const fakeFetch: FetchFn = (url, init) => {
  if (url.startsWith('https://a.test')) return Promise.resolve({ status: 200 });
  if (url === 'https://b.test/health') return Promise.resolve({ status: 404 });
  if (url === 'https://b.test/') return Promise.resolve({ status: 302 });
  if (url.startsWith('https://d.test')) return Promise.resolve({ status: 503 });
  return new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(new Error('abort'))));
};

describe('status ao vivo dos projetos', () => {
  it('classifica cada projeto e respeita o timeout', async () => {
    const svc = new StatusService(projects, { timeoutMs: 50, cacheSeconds: 300 }, fakeFetch);
    const snap = await svc.getAll();
    const by = Object.fromEntries(snap.projects.map((p) => [p.slug, p]));
    expect(by.a).toMatchObject({ state: 'no_ar', httpStatus: 200 });
    expect(by.a.responseMs).toBeGreaterThanOrEqual(0);
    expect(by.b).toMatchObject({ state: 'no_ar', httpStatus: 302 });
    expect(by.c).toMatchObject({ state: 'sem_resposta', httpStatus: null, responseMs: null });
    expect(by.d).toMatchObject({ state: 'instavel', httpStatus: 503 });
  });

  it('usa cache: não consulta de novo dentro da janela', async () => {
    let t = 0;
    const spy = vi.fn<FetchFn>(() => Promise.resolve({ status: 200 }));
    const svc = new StatusService(projects.slice(0, 1), { timeoutMs: 50, cacheSeconds: 300 }, spy, () => t);
    await svc.getAll();
    t += 299_000;
    await svc.getAll();
    expect(spy).toHaveBeenCalledTimes(1);
    t += 2_000;
    await svc.getAll();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('unifica consultas simultâneas', async () => {
    const spy = vi.fn<FetchFn>(() => new Promise((r) => setTimeout(() => r({ status: 200 }), 10)));
    const svc = new StatusService(projects.slice(0, 1), { timeoutMs: 500, cacheSeconds: 300 }, spy);
    await Promise.all([svc.getAll(), svc.getAll(), svc.getAll()]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('expõe GET /api/projetos/status', async () => {
    const { app } = await makeTestApp({ projects: projects.slice(0, 1), fetchFn: fakeFetch });
    const res = await request(app).get('/api/projetos/status');
    expect(res.status).toBe(200);
    expect(res.body.projects[0]).toMatchObject({ slug: 'a', state: 'no_ar' });
    expect(res.body.cacheSeconds).toBe(300);
  });
});
