import { CONSENT_VERSION } from '../domain/consent.js';
import { contactInputSchema, type ContactMessage } from '../domain/contact.js';
import { notFound } from '../domain/errors.js';
import type { ContactRepository } from '../repositories/contactRepository.js';

/** Mensagens de contato ficam guardadas por até 12 meses (ver Política de Privacidade). */
export const CONTACT_RETENTION_DAYS = 365;

export class ContactService {
  constructor(private readonly repo: ContactRepository) {}

  async send(input: unknown): Promise<{ received: true }> {
    const data = contactInputSchema.parse(input);
    // Robô preencheu o campo-isca: responde igual, mas não grava nada.
    if (data.website) return { received: true };
    await this.repo.create({ ...data, consentVersion: CONSENT_VERSION });
    return { received: true };
  }

  list(): Promise<ContactMessage[]> {
    return this.repo.list();
  }

  async markRead(id: number): Promise<ContactMessage> {
    const msg = await this.repo.markRead(id);
    if (!msg) throw notFound('Mensagem não encontrada.');
    return msg;
  }

  async delete(id: number): Promise<void> {
    if (!(await this.repo.delete(id))) throw notFound('Mensagem não encontrada.');
  }

  purgeExpired(): Promise<number> {
    return this.repo.deleteOlderThan(CONTACT_RETENTION_DAYS);
  }
}
