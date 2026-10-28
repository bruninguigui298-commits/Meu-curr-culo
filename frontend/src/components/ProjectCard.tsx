import { Link } from 'react-router-dom';
import type { ProjectStatus } from '../api/types';
import type { Project } from '../lib/projects';
import { StatusBadge } from './StatusBadge';

interface Props {
  project: Project;
  status: ProjectStatus | undefined;
  loading: boolean;
  error: boolean;
  headingLevel?: 'h2' | 'h3';
}

export function ProjectCard({ project, status, loading, error, headingLevel = 'h3' }: Props) {
  const H = headingLevel;
  return (
    <article className="pcard">
      <div className="pcard__top">
        <H className="pcard__name">
          <Link to={`/projetos/${project.slug}`} className="pcard__link">{project.name}</Link>
        </H>
        <StatusBadge status={status} loading={loading} error={error} privateProject={!project.url} />
      </div>
      <p className="pcard__kind">{project.kind}</p>
      <p className="pcard__summary">{project.summary}</p>
      <ul className="tags" aria-label="Tecnologias">
        {project.stack.slice(0, 4).map((s) => <li key={s}>{s}</li>)}
      </ul>
      <span className="pcard__more" aria-hidden="true">Ler o caso →</span>
    </article>
  );
}
