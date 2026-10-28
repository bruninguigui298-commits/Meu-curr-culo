import type { MonitoredProject, ProjectStatus } from '../domain/projects.js';

export type FetchFn = (url: string, init: { method: string; signal: AbortSignal; redirect: 'manual' | 'follow'; headers: Record<string, string> }) => Promise<{ status: number }>;

export interface StatusSnapshot {
  checkedAt: string;
  cacheSeconds: number;
  projects: ProjectStatus[];
}

/**
 * Consulta se cada projeto responde e quanto tempo leva.
 * - Um prazo (timeout) por projeto: quem não responde a tempo vira "sem_resposta".
 * - Cache no servidor: no máximo uma rodada a cada `cacheSeconds`, não importa quantas visitas.
 * - Rodadas simultâneas são unificadas (uma consulta só em andamento).
 * Não há verificação em segundo plano: só consulta quando alguém abre o site, para não manter
 * acordados (e gastando horas grátis) os serviços do Render.
 */
export class StatusService {
  private cache: { at: number; snapshot: StatusSnapshot } | null = null;
  private inFlight: Promise<StatusSnapshot> | null = null;

  constructor(
    private readonly projects: MonitoredProject[],
    private readonly opts: { timeoutMs: number; cacheSeconds: number },
    private readonly fetchFn: FetchFn = fetch as unknown as FetchFn,
    private readonly now: () => number = Date.now,
  ) {}

  async getAll(): Promise<StatusSnapshot> {
    if (this.cache && this.now() - this.cache.at < this.opts.cacheSeconds * 1000) return this.cache.snapshot;
    if (!this.inFlight) {
      this.inFlight = this.refresh().finally(() => {
        this.inFlight = null;
      });
    }
    return this.inFlight;
  }

  private async refresh(): Promise<StatusSnapshot> {
    const projects = await Promise.all(this.projects.map((p) => this.check(p)));
    const snapshot: StatusSnapshot = {
      checkedAt: new Date(this.now()).toISOString(),
      cacheSeconds: this.opts.cacheSeconds,
      projects,
    };
    this.cache = { at: this.now(), snapshot };
    return snapshot;
  }

  private async check(p: MonitoredProject): Promise<ProjectStatus> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.opts.timeoutMs);
    const start = this.now();
    const base = { slug: p.slug, name: p.name, url: p.url };
    try {
      let status = await this.get(p.url + p.healthPath, controller.signal);
      if (status === 404 && p.healthPath !== '/') status = await this.get(p.url + '/', controller.signal);
      const ok = status >= 200 && status < 400;
      return {
        ...base,
        state: ok ? 'no_ar' : 'instavel',
        httpStatus: status,
        responseMs: Math.max(0, Math.round(this.now() - start)),
        checkedAt: new Date(this.now()).toISOString(),
      };
    } catch {
      return { ...base, state: 'sem_resposta', httpStatus: null, responseMs: null, checkedAt: new Date(this.now()).toISOString() };
    } finally {
      clearTimeout(timer);
    }
  }

  private async get(url: string, signal: AbortSignal): Promise<number> {
    const res = await this.fetchFn(url, {
      method: 'GET',
      signal,
      redirect: 'manual',
      headers: { 'user-agent': 'curriculo-bruno-status/1.0 (+verificacao de disponibilidade)' },
    });
    return res.status;
  }
}
