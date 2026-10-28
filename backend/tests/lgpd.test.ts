import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { PROTOCOL_REGEX } from '../src/domain/lgpd.js';
import { generateProtocol } from '../src/services/lgpdService.js';
import { makeTestApp } from './helpers.js';

const pedido = { name: 'Carlos', email: 'carlos@example.com', requestType: 'acesso', details: 'Quero saber quais dados meus vocês têm.' };

describe('pedidos LGPD', () => {
  it('gera protocolos no formato esperado', () => {
    for (let i = 0; i < 50; i++) expect(generateProtocol(new Date('2026-10-28'))).toMatch(PROTOCOL_REGEX);
  });

  it('cria o pedido e devolve protocolo', async () => {
    const { app } = await makeTestApp();
    const res = await request(app).post('/api/lgpd/pedidos').send(pedido);
    expect(res.status).toBe(201);
    expect(res.body.protocol).toMatch(PROTOCOL_REGEX);
  });

  it('recusa tipo de pedido desconhecido', async () => {
    const { app } = await makeTestApp();
    const res = await request(app).post('/api/lgpd/pedidos').send({ ...pedido, requestType: 'vender' });
    expect(res.status).toBe(400);
    expect(res.body.error.fields.requestType).toBeTruthy();
  });

  it('consulta só com protocolo + e-mail corretos', async () => {
    const { app } = await makeTestApp();
    const { body } = await request(app).post('/api/lgpd/pedidos').send(pedido);
    const ok = await request(app).post('/api/lgpd/consulta').send({ protocol: body.protocol.toLowerCase(), email: 'CARLOS@example.com' });
    expect(ok.status).toBe(200);
    expect(ok.body.status).toBe('recebido');
    expect(ok.body).not.toHaveProperty('details');
    const wrong = await request(app).post('/api/lgpd/consulta').send({ protocol: body.protocol, email: 'outra@example.com' });
    expect(wrong.status).toBe(404);
  });

  it('tenta outro protocolo quando há colisão', async () => {
    const { container } = await makeTestApp();
    const { LgpdService } = await import('../src/services/lgpdService.js');
    const codes = ['LGPD-2026-AAAAAAAA', 'LGPD-2026-AAAAAAAA', 'LGPD-2026-BBBBBBBB'];
    const svc = new LgpdService(container.repositories.lgpd, () => codes.shift()!);
    expect((await svc.create(pedido)).protocol).toBe('LGPD-2026-AAAAAAAA');
    expect((await svc.create(pedido)).protocol).toBe('LGPD-2026-BBBBBBBB');
  });
});
