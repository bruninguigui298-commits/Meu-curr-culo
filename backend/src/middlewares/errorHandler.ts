import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../domain/errors.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || '_';
      fields[key] ??= issue.message;
    }
    res.status(400).json({ error: { code: 'dados_invalidos', message: 'Confira os campos destacados.', fields } });
    return;
  }
  if (err instanceof AppError) {
    if (err.status === 429) {
      const retry = (err.details as { retryAfterSec?: number } | undefined)?.retryAfterSec;
      if (retry) res.setHeader('Retry-After', String(retry));
    }
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  const status = (err as { status?: number }).status;
  if (status === 404) {
    res.status(404).json({ error: { code: 'nao_encontrado', message: 'Não encontrado.' } });
    return;
  }
  if ((err as { type?: string }).type === 'entity.too.large') {
    res.status(413).json({ error: { code: 'muito_grande', message: 'Envio grande demais.' } });
    return;
  }
  if ((err as { type?: string }).type === 'entity.parse.failed') {
    res.status(400).json({ error: { code: 'json_invalido', message: 'Corpo da requisição inválido.' } });
    return;
  }
  console.error('[erro]', err);
  res.status(500).json({ error: { code: 'erro_interno', message: 'Algo deu errado do nosso lado. Tente de novo em instantes.' } });
};
