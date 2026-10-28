import { Link } from 'react-router-dom';
import { useProjectStatus } from '../hooks/useProjectStatus';
import { formatTime, hostOf } from '../lib/format';
import type { Project } from '../lib/projects';
import { StatusBadge } from './StatusBadge';

/** Painel de despacho: cada linha é um sistema, com luz de status consultada pelo servidor. */
export function ProjectGrid({ items, headingLevel = 'h3' }: { items: Project[]; headingLevel?: 'h2' | 'h3' }) {
  const st = useProjectStatus();
  const H = headingLevel;
  return (
    <>
      <p className="status-note" aria-live="polite">
        {st.loading && 'Consultando agora se cada sistema está respondendo…'}
        {st.error && 'Não consegui consultar o status agora. Os links continuam valendo.'}
        {st.snapshot && (
          <>Status consultado pelo servidor deste site às {formatTime(st.snapshot.checkedAt)}. Atualiza a cada {Math.round(st.snapshot.cacheSeconds / 60)} minutos.</>
        )}
      </p>
      <ul className="board">
        {items.map((p) => (
          <li key={p.slug} className="board__row">
            <StatusBadge status={st.bySlug(p.slug)} loading={st.loading} error={st.error} privateProject={!p.url} />
            <div>
              <H className="board__name"><Link to={`/projetos/${p.slug}`}>{p.name}</Link></H>
              <p className="board__kind">{p.kind}</p>
            </div>
            <p className="board__summary">{p.summary}</p>
            {p.url ? (
              <a className="board__go" href={p.url} target="_blank" rel="noopener noreferrer">
                {hostOf(p.url).replace('.onrender.com', '')}
                <span className="sr-only"> — abrir {p.name} no ar (nova aba)</span>
              </a>
            ) : (
              <span className="board__go muted">privado</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
