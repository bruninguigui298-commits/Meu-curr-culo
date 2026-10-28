import type { ProjectStatus } from '../api/types';
import { formatMs } from '../lib/format';

interface Props {
  status: ProjectStatus | undefined;
  loading: boolean;
  error: boolean;
  privateProject?: boolean;
  long?: boolean;
}

export function StatusBadge({ status, loading, error, privateProject, long }: Props) {
  if (privateProject) return <span className="status status--muted">privado</span>;
  if (loading) return <span className="status status--muted"><span className="status__dot status__dot--pulse" aria-hidden="true" />consultando…</span>;
  if (error || !status) return <span className="status status--muted">status indisponível</span>;
  if (status.state === 'no_ar') {
    return (
      <span className="status status--ok">
        <span className="status__dot" aria-hidden="true" />
        no ar{status.responseMs !== null && <> · {long ? 'respondeu em ' : ''}{formatMs(status.responseMs)}</>}
      </span>
    );
  }
  if (status.state === 'instavel') {
    return (
      <span className="status status--warn">
        <span className="status__dot" aria-hidden="true" />
        respondeu com erro{status.httpStatus ? ` (${status.httpStatus})` : ''}
      </span>
    );
  }
  return (
    <span className="status status--warn" title="Servidores gratuitos do Render dormem sem visitas e levam alguns segundos para acordar.">
      <span className="status__dot" aria-hidden="true" />
      {long ? 'sem resposta no tempo limite — o servidor gratuito pode estar acordando' : 'sem resposta'}
    </span>
  );
}
