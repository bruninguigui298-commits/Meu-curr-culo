/**
 * Limite de envios por chave (ex.: IP) em janela fixa, em memória.
 * O IP não é gravado em lugar nenhum: fica só aqui, durante a janela.
 */
export class RateLimiter {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  hit(key: string): { allowed: boolean; retryAfterSec: number } {
    const t = this.now();
    if (this.hits.size > 10_000) this.prune(t);
    const entry = this.hits.get(key);
    if (!entry || entry.resetAt <= t) {
      this.hits.set(key, { count: 1, resetAt: t + this.windowMs });
      return { allowed: true, retryAfterSec: 0 };
    }
    entry.count += 1;
    const retryAfterSec = Math.ceil((entry.resetAt - t) / 1000);
    return { allowed: entry.count <= this.max, retryAfterSec };
  }

  private prune(t: number) {
    for (const [k, v] of this.hits) if (v.resetAt <= t) this.hits.delete(k);
  }
}
