import { existsSync } from 'node:fs';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import type { Container } from './container.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { buildRoutes } from './routes/index.js';

export function createApp(container: Container, opts: { staticDir?: string } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // Render fica atrás de um proxy: req.ip vem do X-Forwarded-For.

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );
  app.use(express.json({ limit: '20kb' }));
  app.use(cookieParser());

  app.use('/api', buildRoutes(container));

  const staticDir = opts.staticDir;
  if (staticDir && existsSync(path.join(staticDir, 'index.html'))) {
    app.use(
      '/assets',
      express.static(path.join(staticDir, 'assets'), { immutable: true, maxAge: '1y', fallthrough: false }),
    );
    app.use(express.static(staticDir, { index: false, maxAge: '1h' }));
    // SPA: qualquer GET que não seja da API devolve o index.html.
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  app.use(errorHandler);
  return app;
}
