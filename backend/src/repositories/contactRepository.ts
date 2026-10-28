import type { Db } from '../database/db.js';
import type { ContactMessage } from '../domain/contact.js';

interface Row {
  id: string | number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  consent_version: string;
  consent_at: Date | string;
  created_at: Date | string;
  read_at: Date | string | null;
}

const iso = (d: Date | string | null) => (d === null ? null : new Date(d).toISOString());

function toMessage(r: Row): ContactMessage {
  return {
    id: Number(r.id),
    name: r.name,
    email: r.email,
    company: r.company,
    message: r.message,
    consentVersion: r.consent_version,
    consentAt: iso(r.consent_at)!,
    createdAt: iso(r.created_at)!,
    readAt: iso(r.read_at),
  };
}

export class ContactRepository {
  constructor(private readonly db: Db) {}

  async create(data: { name: string; email: string; company?: string; message: string; consentVersion: string }): Promise<ContactMessage> {
    const { rows } = await this.db.query<Row>(
      `INSERT INTO contact_messages (name, email, company, message, consent_version, consent_at)
       VALUES ($1, $2, $3, $4, $5, now())
       RETURNING *`,
      [data.name, data.email, data.company ?? null, data.message, data.consentVersion],
    );
    return toMessage(rows[0]);
  }

  async list(limit = 100): Promise<ContactMessage[]> {
    const { rows } = await this.db.query<Row>('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC LIMIT $1', [limit]);
    return rows.map(toMessage);
  }

  async markRead(id: number): Promise<ContactMessage | null> {
    const { rows } = await this.db.query<Row>(
      'UPDATE contact_messages SET read_at = COALESCE(read_at, now()) WHERE id = $1 RETURNING *',
      [id],
    );
    return rows[0] ? toMessage(rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const { rows } = await this.db.query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);
    return rows.length > 0;
  }

  /** Retenção: apaga mensagens mais antigas que N dias. */
  async deleteOlderThan(days: number): Promise<number> {
    const { rows } = await this.db.query(
      `DELETE FROM contact_messages WHERE created_at < now() - ($1::int * interval '1 day') RETURNING id`,
      [days],
    );
    return rows.length;
  }
}
