import { Router } from 'express';
import type { Container } from '../container.js';
import { noStore } from '../middlewares/noStore.js';
import { rateLimit } from '../middlewares/rateLimit.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';

export function buildRoutes(c: Container): Router {
  const r = Router();

  r.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Público
  r.get('/projetos/status', c.controllers.status.list);
  r.post('/contato', noStore, rateLimit(c.limiters.contact), c.controllers.contact.send);
  r.post('/lgpd/pedidos', noStore, rateLimit(c.limiters.lgpd), c.controllers.lgpd.create);
  r.post('/lgpd/consulta', noStore, rateLimit(c.limiters.lookup), c.controllers.lgpd.lookup);

  // Admin
  const admin = Router();
  admin.use(noStore);
  admin.post('/login', rateLimit(c.limiters.login), c.controllers.admin.login);
  admin.get('/sessao', requireAdmin(c.services.auth, { csrf: false }), c.controllers.admin.session);
  admin.post('/logout', requireAdmin(c.services.auth), c.controllers.admin.logout);
  admin.use(requireAdmin(c.services.auth));
  admin.get('/mensagens', c.controllers.contact.list);
  admin.patch('/mensagens/:id/lida', c.controllers.contact.markRead);
  admin.delete('/mensagens/:id', c.controllers.contact.delete);
  admin.get('/lgpd', c.controllers.lgpd.list);
  admin.patch('/lgpd/:id', c.controllers.lgpd.updateStatus);
  r.use('/admin', admin);

  r.use((_req, res) => {
    res.status(404).json({ error: { code: 'nao_encontrado', message: 'Rota não encontrada.' } });
  });
  return r;
}
