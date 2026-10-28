import { Link, useParams } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProjectStatus } from '../hooks/useProjectStatus';
import { hostOf } from '../lib/format';
import { findProject, projects } from '../lib/projects';
import { NotFound } from './NotFound';

export function Caso() {
  const { slug } = useParams();
  const project = findProject(slug);
  useDocumentTitle(project ? `Caso: ${project.name}` : 'Página não encontrada');
  const st = useProjectStatus();
  if (!project) return <NotFound />;

  const i = projects.indexOf(project);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <article className="wrap page case">
      <p><Link to="/projetos" className="back-link">← Todos os projetos</Link></p>
      <header className="case__head">
        <p className="eyebrow">Caso · {project.kind}</p>
        <h1 className="case__title">{project.name}</h1>
        <p className="lead">{project.summary}</p>
        <div className="case__meta">
          <StatusBadge status={st.bySlug(project.slug)} loading={st.loading} error={st.error} privateProject={!project.url} long />
          {project.url && (
            <a className="btn btn--solid" href={project.url} target="_blank" rel="noopener noreferrer">
              Abrir {hostOf(project.url)} ↗<span className="sr-only"> (abre em nova aba)</span>
            </a>
          )}
        </div>
        {project.urlNote && <p className="case__note">{project.urlNote}</p>}
      </header>

      {project.shots.length > 0 ? (
        <div className="shots">
          {project.shots.map((s) => <img key={s.src} src={s.src} alt={s.alt} loading="lazy" />)}
        </div>
      ) : (
        <div className="shots shots--empty">
          <p>Prints do sistema chegam em breve. {project.url ? 'Enquanto isso, ele está no ar no link acima.' : ''}</p>
        </div>
      )}

      <div className="case__grid">
        <div className="case__main">
          <section aria-labelledby="c-problema">
            <h2 id="c-problema" className="h2">O problema</h2>
            <p>{project.problem}</p>
          </section>
          <section aria-labelledby="c-faz">
            <h2 id="c-faz" className="h2">O que o sistema faz</h2>
            <ul className="bullets">{project.features.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
          <section aria-labelledby="c-decisoes">
            <h2 id="c-decisoes" className="h2">Decisões</h2>
            <ul className="bullets">{project.decisions.map((d) => <li key={d}>{d}</li>)}</ul>
          </section>
          <section aria-labelledby="c-licoes">
            <h2 id="c-licoes" className="h2">O que deu errado e como resolvi</h2>
            {project.lessons.length > 0 ? (
              <ul className="bullets">{project.lessons.map((l) => <li key={l}>{l}</li>)}</ul>
            ) : (
              <p className="muted">
                Estou escrevendo esta parte com as minhas palavras — prefiro deixar em branco a inventar.
              </p>
            )}
          </section>
        </div>
        <aside className="case__side" aria-label="Ficha técnica">
          <dl>
            <dt>Stack</dt>
            <dd>{project.stack.join(' · ')}</dd>
            <dt>Meu papel</dt>
            <dd>{project.role}</dd>
            <dt>Código</dt>
            <dd>{project.code}</dd>
            <dt>Com IA</dt>
            <dd>Claude Code como copiloto. Decisões, revisão, testes e deploy são meus.</dd>
          </dl>
        </aside>
      </div>

      <nav className="case__nav" aria-label="Outros casos">
        <Link to={`/projetos/${prev.slug}`}><span className="sr-only">Caso anterior: </span>← {prev.name}</Link>
        <Link to={`/projetos/${next.slug}`}><span className="sr-only">Próximo caso: </span>{next.name} →</Link>
      </nav>
    </article>
  );
}
