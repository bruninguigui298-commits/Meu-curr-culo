import type { CookieOptions, Request, Response } from 'express';
import { unauthorized } from '../domain/errors.js';
import { ADMIN_COOKIE } from '../middlewares/requireAdmin.js';
import { AuthService } from '../services/authService.js';

export class AdminController {
  constructor(
    private readonly auth: AuthService,
    private readonly secureCookies: boolean,
  ) {}

  private get cookieOptions(): CookieOptions {
    return { httpOnly: true, sameSite: 'strict', secure: this.secureCookies, path: '/api/admin' };
  }

  login = async (req: Request, res: Response) => {
    if (!this.auth.checkPassword(req.body?.password)) throw unauthorized('Senha incorreta.');
    const { token, session } = this.auth.createSession();
    res.cookie(ADMIN_COOKIE, token, { ...this.cookieOptions, maxAge: AuthService.TTL_MS });
    res.json({ csrfToken: session.csrf, expiresAt: new Date(session.exp).toISOString() });
  };

  /** Recupera o token anti-CSRF depois de recarregar a página (só funciona com o cookie). */
  session = async (_req: Request, res: Response) => {
    const s = res.locals.adminSession as { csrf: string; exp: number };
    res.json({ csrfToken: s.csrf, expiresAt: new Date(s.exp).toISOString() });
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie(ADMIN_COOKIE, this.cookieOptions);
    res.status(204).end();
  };
}
