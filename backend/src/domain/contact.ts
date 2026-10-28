import { z } from 'zod';

const clean = (max: number) => z.string().trim().min(1, 'Campo obrigatório.').max(max, `Máximo de ${max} caracteres.`);

export const contactInputSchema = z.object({
  name: clean(120),
  email: z.string().trim().toLowerCase().max(254).email('E-mail inválido.'),
  company: z.string().trim().max(120).optional().transform((v) => (v ? v : undefined)),
  message: clean(4000).refine((v) => v.length >= 10, 'Escreva pelo menos 10 caracteres.'),
  consent: z.literal(true, { message: 'É preciso concordar com a Política de Privacidade.' }),
  /** Campo-isca invisível: pessoas deixam vazio, robôs preenchem. */
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactInputSchema>;

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  consentVersion: string;
  consentAt: string;
  createdAt: string;
  readAt: string | null;
}
