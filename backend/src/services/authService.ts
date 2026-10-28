import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export interface AdminSession {
  csrf: string;
  exp: number;
}

const sha256 = (s: string) => createHash('sha256').update(s).digest();

/**
 * Sessão do admin sem tabela: o cookie carrega {csrf, exp} assinado com HMAC.
 * O cookie é httpOnly; o token anti-CSRF volta no corpo do login e precisa ir no
 * cabeçalho `x-csrf-token` de toda chamada do /admin.
 */
export class AuthService {
  static readonly TTL_MS = 8 * 60 * 60 * 1000;

  constructor(
    private readonly adminPassword: string,
    private readonly secret: string,
    private readonly now: () => number = Date.now,
  ) {}

  checkPassword(candidate: unknown): boolean {
    if (typeof candidate !== 'string' || candidate.length === 0 || candidate.length > 200) return false;
    return timingSafeEqual(sha256(candidate), sha256(this.adminPassword));
  }

  createSession(): { token: string; session: AdminSession } {
    const session: AdminSession = { csrf: randomBytes(24).toString('base64url'), exp: this.now() + AuthService.TTL_MS };
    const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
    return { token: `${payload}.${this.sign(payload)}`, session };
  }

  verify(token: unknown): AdminSession | null {
    if (typeof token !== 'string') return null;
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const expected = Buffer.from(this.sign(payload));
    const given = Buffer.from(sig);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    try {
      const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as AdminSession;
      if (typeof session.csrf !== 'string' || typeof session.exp !== 'number' || session.exp <= this.now()) return null;
      return session;
    } catch {
      return null;
    }
  }

  csrfMatches(session: AdminSession, header: unknown): boolean {
    if (typeof header !== 'string') return false;
    const a = Buffer.from(session.csrf);
    const b = Buffer.from(header);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.secret).update(payload).digest('base64url');
  }
}
