import type { Db } from '../database/db.js';
import type { LgpdRequest, LgpdRequestType, LgpdStatus } from '../domain/lgpd.js';

interface Row {
  id: string | number;
  protocol: string;
  name: string;
  email: string;
  request_type: LgpdRequestType;
  details: string | null;
  status: LgpdStatus;
  created_at: Date | string;
  updated_at: Date | string;
}

function toRequest(r: Row): LgpdRequest {
  return {
    id: Number(r.id),
    protocol: r.protocol,
    name: r.name,
    email: r.email,
    requestType: r.request_type,
    details: r.details,
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

export class LgpdRepository {
  constructor(private readonly db: Db) {}

  async create(data: { protocol: string; name: string; email: string; requestType: LgpdRequestType; details?: string }): Promise<LgpdRequest> {
    const { rows } = await this.db.query<Row>(
      `INSERT INTO lgpd_requests (protocol, name, email, request_type, details)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.protocol, data.name, data.email, data.requestType, data.details ?? null],
    );
    return toRequest(rows[0]);
  }

  async findByProtocol(protocol: string): Promise<LgpdRequest | null> {
    const { rows } = await this.db.query<Row>('SELECT * FROM lgpd_requests WHERE protocol = $1', [protocol]);
    return rows[0] ? toRequest(rows[0]) : null;
  }

  async list(limit = 100): Promise<LgpdRequest[]> {
    const { rows } = await this.db.query<Row>('SELECT * FROM lgpd_requests ORDER BY created_at DESC, id DESC LIMIT $1', [limit]);
    return rows.map(toRequest);
  }

  async updateStatus(id: number, status: LgpdStatus): Promise<LgpdRequest | null> {
    const { rows } = await this.db.query<Row>(
      'UPDATE lgpd_requests SET status = $2, updated_at = now() WHERE id = $1 RETURNING *',
      [id, status],
    );
    return rows[0] ? toRequest(rows[0]) : null;
  }
}
