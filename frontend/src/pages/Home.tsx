import { Link } from 'react-router-dom';
import { BuildIntro, useBuildIntro } from '../components/BuildIntro';
import { ProjectGrid } from '../components/ProjectGrid';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { profile } from '../lib/profile';
import { liveProjects } from '../lib/projects';
import { timeline } from '../lib/timeline';
import { workflow } from '../lib/workflow';

export function Home() {
  useDocumentTitle('');
  const intro = useBuildIntro();
  const r = (at: number) => (intro.stage >= at ? 'reveal is-in' : 'reveal');

  return (
    <div className="home">
      <section className="hero wrap" aria-labelledby="hero-titulo">
        <div className="hero__text">
          <p className={`eyebrow ${r(2)}`}>{profile.role} · vibe coder · {profile.location}</p>
          <h1 id="hero-titulo" className={`hero__title ${r(2)}`}>
            Eu dirijo,<br />a IA acelera.
          </h1>
          <p className={`hero__lead ${r(2)}`}>
            Sou o {profile.shortName}, {profile.age} anos. Vim da área comercial e hoje construo sistemas completos —
            backend em camadas, testes e deploy — com o Claude Code como copiloto. <strong>Eu decido, reviso, testo e
            publico.</strong> Os sistemas abaixo estão no ar agora; dá para conferir.
          </p>
          <div className={`hero__ctas ${r(2)}`}>
            <Link className="btn btn--solid" to="/projetos">Ver projetos no ar</Link>
            <Link className="btn btn--line" to="/como-trabalho-com-ia">Como eu trabalho com IA</Link>
          </div>
        </div>
        <BuildIntro typed={intro.typed} stage={intro.stage} done={intro.done} onSkip={intro.skip} />
      </section>

      <section className={`band wrap ${r(4)}`} aria-labelledby="projetos-titulo">
        <div className="band__head">
          <div>
            <p className="eyebrow">01 — Projetos no ar agora</p>
            <h2 id="projetos-titulo" className="display">Prova, não promessa.</h2>
          </div>
          <Link to="/projetos" className="arrow-link">Todos os projetos e casos →</Link>
        </div>
        <ProjectGrid items={liveProjects} />
      </section>

      <section className={`band band--dark ${r(3)}`} aria-labelledby="ia-titulo">
        <div className="wrap">
          <p className="eyebrow eyebrow--dark">02 — Como eu trabalho com IA</p>
          <h2 id="ia-titulo" className="display">Eu decido. A IA escreve junto.<br />Eu testo, reviso e publico.</h2>
          <ol className="steps">
            {workflow.map((w, i) => (
              <li key={w.step} className="step">
                <span className="step__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="step__t">{w.step}</h3>
                <p className="step__d">{w.text}</p>
              </li>
            ))}
          </ol>
          <Link to="/como-trabalho-com-ia" className="arrow-link arrow-link--dark">O que a IA faz e o que é responsabilidade minha →</Link>
        </div>
      </section>

      <section className={`band wrap ${r(5)}`} aria-labelledby="tl-titulo">
        <p className="eyebrow">03 — Linha do tempo</p>
        <h2 id="tl-titulo" className="sr-only">Linha do tempo</h2>
        <ol className="tl-row">
          {timeline.map((t) => (
            <li key={t.title}>
              <h3 className="tl-row__t">{t.title}</h3>
              <p className="tl-row__d">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`band wrap contact-cta ${r(5)}`} aria-labelledby="cta-titulo">
        <h2 id="cta-titulo" className="display display--italic">Vamos conversar?</h2>
        <p>
          <Link to="/contato" className="btn btn--solid">Mandar mensagem</Link>{' '}
          <a href={`mailto:${profile.email}`} className="mono-link">{profile.email}</a>
        </p>
      </section>
    </div>
  );
}
