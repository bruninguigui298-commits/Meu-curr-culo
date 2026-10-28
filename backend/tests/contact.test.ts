import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { makeTestApp, validContact } from './helpers.js';

describe('POST /api/contato', () => {
  it('grava a mensagem com o consentimento e o e-mail normalizado', async () => {
    const { app, container } = await makeTestApp();
    const res = await request(app).post('/api/contato').send(validContact);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ received: true });
    const [msg] = await container.repositories.contact.list();
    expect(msg.email).toBe('ana@empresa.com.br');
    expect(msg.consentVersion).toBe('2026-10');
    expect(msg.consentAt).toBeTruthy();
  });

  it('recusa sem consentimento', async () => {
    const { app, container } = await makeTestApp();
    const res = await request(app).post('/api/contato').send({ ...validContact, consent: false });
    expect(res.status).toBe(400);
    expect(res.body.error.fields.consent).toMatch(/Política de Privacidade/);
    expect(await container.repositories.contact.list()).toHaveLength(0);
  });

  it('valida e-mail e tamanho da mensagem', async () => {
    const { app } = await makeTestApp();
    const res = await request(app).post('/api/contato').send({ ...validContact, email: 'nao-e-email', message: 'oi' });
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.error.fields).sort()).toEqual(['email', 'message']);
  });

  it('finge sucesso e não grava quando o campo-isca vem preenchido', async () => {
    const { app, container } = await makeTestApp();
    const res = await request(app).post('/api/contato').send({ ...validContact, website: 'http://spam' });
    expect(res.status).toBe(201);
    expect(await container.repositories.contact.list()).toHaveLength(0);
  });

  it('limita a 3 envios por hora por IP', async () => {
    const { app } = await makeTestApp();
    for (let i = 0; i < 3; i++) expect((await request(app).post('/api/contato').send(validContact)).status).toBe(201);
    const blocked = await request(app).post('/api/contato').send(validContact);
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);
  });

  it('libera de novo depois da janela', async () => {
    let t = 1_000_000;
    const { app } = await makeTestApp({ now: () => t });
    for (let i = 0; i < 3; i++) await request(app).post('/api/contato').send(validContact);
    expect((await request(app).post('/api/contato').send(validContact)).status).toBe(429);
    t += 61 * 60 * 1000;
    expect((await request(app).post('/api/contato').send(validContact)).status).toBe(201);
  });

  it('rejeita corpo grande demais', async () => {
    const { app } = await makeTestApp();
    const res = await request(app).post('/api/contato').send({ ...validContact, message: 'x'.repeat(30_000) });
    expect(res.status).toBe(413);
  });
});
