export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export const notFound = (msg = 'Não encontrado.') => new AppError(404, 'nao_encontrado', msg);
export const unauthorized = (msg = 'Faça login para continuar.') => new AppError(401, 'nao_autorizado', msg);
export const forbidden = (msg = 'Ação não permitida.') => new AppError(403, 'proibido', msg);
export const tooMany = (retryAfterSec: number) =>
  new AppError(429, 'muitas_tentativas', `Muitos envios em pouco tempo. Tente de novo em ${Math.ceil(retryAfterSec / 60)} min.`, { retryAfterSec });
