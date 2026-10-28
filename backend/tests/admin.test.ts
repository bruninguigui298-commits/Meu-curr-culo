import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { makeTestApp, TEST_PASSWORD, validContact } from './helpers.js';

async function login(app: Parameters<typeof request>[0]) {
  const res = await request(app).post('/api/admin/login').send({ password: TEST_PASSWORD });
  expect(res.status).toBe(200);
  const cookie = res.headers['set-cookie'] as unknown as string[];
  return { cookie, csrf: res.body.csrfToken as string, res };
}

describe('/api/admin', () => {
  it('cookie de sessão é httpOnly, SameSite=Strict e restrito a /api/admin', async () => {
    const { app } = await makeTestApp();
    const { cookie } = await login(app);
    expect(cookie[0]).toMatch(/bp_admin=/);
    expect(cookie[0]).toMatch(/HttpOnly/);
    expect(cookie[0]).toMatch(/SameSite=Strict/);
    expect(cookie[0]).toMatch(/Path=\/api\/admin/);
  });

  it('recusa senha errada', async () => {
    const { app } = await makeTestApp();
    const res = await request(app).post('/api/admin/login').send({ password: 'errada' });
    expect(res.status).toBe(401);
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('sem cookie → 401; com cookie mas sem cabeçalho anti-CSRF → 403', async () => {
    const { app } = await makeTestApp();
    expect((await request(app).get('/api/admin/mensagens')).status).toBe(401);
    const { cookie } = await login(app);
    expect((await request(app).get('/api/admin/mensagens').set('Cookie', cookie)).status).toBe(403);
    expect((await request(app).get('/api/admin/mensagens').set('Cookie', cookie).set('x-csrf-token', 'outro')).status).toBe(403);
  });

  it('lê, marca como lida e apaga mensagens', async () => {
    const { app } = await makeTestApp();
    await request(app).post('/api/contato').send(validContact);
    const { cookie, csrf } = await login(app);
    const auth = (r: request.Test) => r.set('Cookie', cookie).set('x-csrf-token', csrf);

    const list = await auth(request(app).get('/api/admin/mensagens'));
    expect(list.status).toBe(200);
    expect(list.headers['cache-control']).toBe('no-store');
    expect(list.body.messages).toHaveLength(1);
    const id = list.body.messages[0].id;

    const read = await auth(request(app).patch(`/api/admin/mensagens/${id}/lida`));
    expect(read.body.message.readAt).toBeTruthy();

    expect((await auth(request(app).delete(`/api/admin/mensagens/${id}`))).status).toBe(204);
    expect((await auth(request(app).delete(`/api/admin/mensagens/${id}`))).status).toBe(404);
  });

  it('recupera o token anti-CSRF pelo cookie (recarregar a página)', async () => {
    const { app } = await makeTestApp();
    const { cookie, csrf } = await login(app);
    const res = await request(app).get('/api/admin/sessao').set('Cookie', cookie);
    expect(res.body.csrfToken).toBe(csrf);
  });

  it('cookie adulterado não vale', async () => {
    const { app } = await makeTestApp();
    const { cookie } = await login(app);
    const forged = cookie[0].replace(/bp_admin=([^.]+)\./, 'bp_admin=$1x.');
    expect((await request(app).get('/api/admin/sessao').set('Cookie', forged)).status).toBe(401);
  });

  it('sessão expira em 8 horas', async () => {
    let t = 5_000_000;
    const { app } = await makeTestApp({ now: () => t });
    const { cookie } = await login(app);
    t += 8 * 60 * 60 * 1000 + 1;
    expect((await request(app).get('/api/admin/sessao').set('Cookie', cookie)).status).toBe(401);
  });

  it('atualiza status de pedido LGPD', async () => {
    const { app } = await makeTestApp();
    await request(app).post('/api/lgpd/pedidos').send({ name: 'X', email: 'x@example.com', requestType: 'eliminacao' });
    const { cookie, csrf } = await login(app);
    const list = await request(app).get('/api/admin/lgpd').set('Cookie', cookie).set('x-csrf-token', csrf);
    const id = list.body.requests[0].id;
    const upd = await request(app).patch(`/api/admin/lgpd/${id}`).set('Cookie', cookie).set('x-csrf-token', csrf).send({ status: 'concluido' });
    expect(upd.body.request.status).toBe('concluido');
    const bad = await request(app).patch(`/api/admin/lgpd/${id}`).set('Cookie', cookie).set('x-csrf-token', csrf).send({ status: 'xyz' });
    expect(bad.status).toBe(400);
  });

  it('limita tentativas de login', async () => {
    const { app } = await makeTestApp();
    for (let i = 0; i < 5; i++) await request(app).post('/api/admin/login').send({ password: 'errada' });
    expect((await request(app).post('/api/admin/login').send({ password: TEST_PASSWORD })).status).toBe(429);
  });
});
