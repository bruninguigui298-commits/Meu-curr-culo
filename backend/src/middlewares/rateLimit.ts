import type { RequestHandler } from 'express';
import { tooMany } from '../domain/errors.js';
import type { RateLimiter } from '../services/rateLimiter.js';

export function rateLimit(limiter: RateLimiter): RequestHandler {
  return (req, _res, next) => {
    const { allowed, retryAfterSec } = limiter.hit(req.ip ?? 'desconhecido');
    if (!allowed) return next(tooMany(retryAfterSec));
    next();
  };
}
