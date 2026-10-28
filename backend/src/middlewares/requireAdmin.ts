import type { RequestHandler } from 'express';
import { forbidden, unauthorized } from '../domain/errors.js';
import type { AuthService } from '../services/authService.js';

export const ADMIN_COOKIE = 'bp_admin';

/** Exige cookie de sessão válido E o cabeçalho anti-CSRF que bate com a sessão. */
export function requireAdmin(auth: AuthService, { csrf = true } = {}): RequestHandler {
  return (req, res, next) => {
    const session = auth.verify(req.cookies?.[ADMIN_COOKIE]);
    if (!session) return next(unauthorized());
    if (csrf && !auth.csrfMatches(session, req.get('x-csrf-token'))) return next(forbidden('Token anti-CSRF ausente ou inválido.'));
    res.locals.adminSession = session;
    next();
  };
}
