import { randomInt } from 'node:crypto';
import { notFound } from '../domain/errors.js';
import {
  lgpdInputSchema,
  lgpdStatusSchema,
  protocolLookupSchema,
  type LgpdRequest,
  type LgpdStatus,
} from '../domain/lgpd.js';
import type { LgpdRepository } from '../repositories/lgpdRepository.js';

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function generateProtocol(now = new Date()): string {
  let code = '';
  for (let i = 0; i < 8; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `LGPD-${now.getFullYear()}-${code}`;
}

export class LgpdService {
  constructor(
    private readonly repo: LgpdRepository,
    private readonly newProtocol: () => string = generateProtocol,
  ) {}

  async create(input: unknown): Promise<{ protocol: string; createdAt: string } | { protocol: null }> {
    const data = lgpdInputSchema.parse(input);
    if (data.website) return { protocol: null };
    for (let attempt = 0; ; attempt++) {
      try {
        const req = await this.repo.create({ ...data, protocol: this.newProtocol() });
        return { protocol: req.protocol, createdAt: req.createdAt };
      } catch (err) {
        // Colisão de protocolo (muito improvável): tenta outro.
        const isUnique = (err as { code?: string }).code === '23505';
        if (!isUnique || attempt >= 4) throw err;
      }
    }
  }

  /** Consulta pública: só responde se protocolo e e-mail baterem (não revela se o protocolo existe). */
  async lookup(input: unknown): Promise<{ protocol: string; status: LgpdStatus; createdAt: string; updatedAt: string }> {
    const { protocol, email } = protocolLookupSchema.parse(input);
    const req = await this.repo.findByProtocol(protocol);
    if (!req || req.email !== email) throw notFound('Não achamos um pedido com esse protocolo e e-mail.');
    return { protocol: req.protocol, status: req.status, createdAt: req.createdAt, updatedAt: req.updatedAt };
  }

  list(): Promise<LgpdRequest[]> {
    return this.repo.list();
  }

  async updateStatus(id: number, input: unknown): Promise<LgpdRequest> {
    const { status } = lgpdStatusSchema.parse(input);
    const req = await this.repo.updateStatus(id, status);
    if (!req) throw notFound('Pedido não encontrado.');
    return req;
  }
}
