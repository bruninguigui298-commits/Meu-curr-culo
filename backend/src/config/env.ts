import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DEMO: z
      .string()
      .optional()
      .transform((v) => v === '1' || v === 'true'),
    DATABASE_URL: z.string().optional(),
    ADMIN_PASSWORD: z.string().default('demo-admin-senha'),
    SESSION_SECRET: z.string().default('segredo-de-desenvolvimento-nao-usar-em-producao'),
    STATUS_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
    STATUS_CACHE_SECONDS: z.coerce.number().int().positive().default(300),
  })
  .superRefine((env, ctx) => {
    if (!env.DEMO && !env.DATABASE_URL) {
      ctx.addIssue({ code: 'custom', path: ['DATABASE_URL'], message: 'DATABASE_URL é obrigatória (ou rode com DEMO=1).' });
    }
    if (env.NODE_ENV === 'production') {
      if (env.ADMIN_PASSWORD.length < 12 || env.ADMIN_PASSWORD === 'demo-admin-senha') {
        ctx.addIssue({ code: 'custom', path: ['ADMIN_PASSWORD'], message: 'Defina ADMIN_PASSWORD com 12+ caracteres.' });
      }
      if (env.SESSION_SECRET.length < 32 || env.SESSION_SECRET.startsWith('segredo-de-desenvolvimento')) {
        ctx.addIssue({ code: 'custom', path: ['SESSION_SECRET'], message: 'Defina SESSION_SECRET com 32+ caracteres.' });
      }
    }
  });

export type Env = z.infer<typeof schema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Configuração inválida:\n${msg}`);
  }
  return parsed.data;
}
