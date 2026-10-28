import { z } from 'zod';

export const LGPD_REQUEST_TYPES = {
  confirmacao: 'Confirmar se trato dados meus',
  acesso: 'Acessar meus dados',
  correcao: 'Corrigir dados incompletos ou errados',
  anonimizacao_bloqueio_eliminacao: 'Anonimizar, bloquear ou eliminar dados desnecessários',
  portabilidade: 'Portabilidade dos dados',
  eliminacao: 'Eliminar dados tratados com meu consentimento',
  informacao_compartilhamento: 'Saber com quem os dados foram compartilhados',
  revogacao_consentimento: 'Revogar meu consentimento',
  outro: 'Outro pedido',
} as const;

export type LgpdRequestType = keyof typeof LGPD_REQUEST_TYPES;
export const LGPD_STATUSES = ['recebido', 'em_andamento', 'concluido', 'recusado'] as const;
export type LgpdStatus = (typeof LGPD_STATUSES)[number];

export const lgpdInputSchema = z.object({
  name: z.string().trim().min(1, 'Campo obrigatório.').max(120),
  email: z.string().trim().toLowerCase().max(254).email('E-mail inválido.'),
  requestType: z.enum(Object.keys(LGPD_REQUEST_TYPES) as [LgpdRequestType, ...LgpdRequestType[]], {
    message: 'Escolha o tipo de pedido.',
  }),
  details: z.string().trim().max(4000).optional().transform((v) => (v ? v : undefined)),
  website: z.string().max(200).optional(),
});

export type LgpdInput = z.infer<typeof lgpdInputSchema>;

export const lgpdStatusSchema = z.object({ status: z.enum(LGPD_STATUSES) });

/** Protocolo: LGPD-AAAA-XXXXXXXX (8 caracteres sem ambiguidade: sem 0/O, 1/I/L). */
export const PROTOCOL_REGEX = /^LGPD-\d{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/;

export const protocolLookupSchema = z.object({
  protocol: z.string().trim().toUpperCase().regex(PROTOCOL_REGEX, 'Protocolo inválido.'),
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
});

export interface LgpdRequest {
  id: number;
  protocol: string;
  name: string;
  email: string;
  requestType: LgpdRequestType;
  details: string | null;
  status: LgpdStatus;
  createdAt: string;
  updatedAt: string;
}
