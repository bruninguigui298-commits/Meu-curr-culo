import { useProjectStatus } from '../hooks/useProjectStatus';
import { formatTime } from '../lib/format';
import type { Project } from '../lib/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectGrid({ items, headingLevel }: { items: Project[]; headingLevel?: 'h2' | 'h3' }) {
  const st = useProjectStatus();
  return (
    <>
      <p className="status-note" aria-live="polite">
        {st.loading && 'Consultando agora se cada sistema está respondendo…'}
        {st.error && 'Não consegui consultar o status agora. Os links continuam valendo.'}
        {st.snapshot && (
          <>Status consultado pelo servidor deste site às {formatTime(st.snapshot.checkedAt)} (atualiza a cada {Math.round(st.snapshot.cacheSeconds / 60)} min).</>
        )}
      </p>
      <div className="pgrid">
        {items.map((p) => (
          <ProjectCard key={p.slug} project={p} status={st.bySlug(p.slug)} loading={st.loading} error={st.error} headingLevel={headingLevel} />
        ))}
      </div>
    </>
  );
}
