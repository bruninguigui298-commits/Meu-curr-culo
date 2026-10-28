import { Link } from 'react-router-dom';
import { BuildIntro, useBuildIntro } from '../components/BuildIntro';
import { FlowField } from '../components/FlowField';
import { ProjectGrid } from '../components/ProjectGrid';
import { RouteStory } from '../components/RouteStory';
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
      <section className="hero" aria-labelledby="hero-titulo">
        <FlowField className="hero__flow" />
        <div className="wrap hero__grid">
          <div>
            <p className={`hero__name ${r(2)}`}>
              <span className="live" aria-hidden="true" />
              {profile.name}, desenvolvedor back-end em {profile.location}
            </p>
            <h1 id="hero-titulo" className={`hero__title ${r(2)}`}>
              Eu dirijo,<br />a IA acelera.
            </h1>
            <p className={`hero__lead ${r(2)}`}>
              Sei programar sozinho e hoje trabalho com vibe coding: eu decido o que construir, a IA escreve junto,
              e eu reviso, testo e publico. Oito sistemas estão no ar agora para você conferir.
            </p>
            <div className={`hero__ctas ${r(2)}`}>
              <Link className="btn btn--solid" to="/projetos">Ver os sistemas no ar</Link>
              <Link className="btn btn--line" to="/curriculo">Currículo em PDF</Link>
            </div>
          </div>
          <BuildIntro typed={intro.typed} stage={intro.stage} done={intro.done} onSkip={intro.skip} />
        </div>
      </section>

      <section className={`band wrap ${r(3)}`} aria-labelledby="duo-titulo">
        <h2 id="duo-titulo" className="display">Programador de base.<br />Vibe coder por escolha.</h2>
        <div className="duo">
          <article className="duo__side duo__side--solo">
            <h3 className="duo__t">Sem IA, eu programo</h3>
            <p>
              Aprendi lógica, JavaScript, Node.js, SQL e APIs no curso de Desenvolvedor Back-end do SENAI. Leio, entendo
              e consigo mexer em cada linha do que eu publico.
            </p>
            <ul aria-label="Base técnica">
              <li>Lógica de programação</li><li>JavaScript e TypeScript</li><li>Node.js</li><li>SQL</li><li>APIs REST</li><li>Git</li>
            </ul>
          </article>
          <article className="duo__side duo__side--ia">
            <h3 className="duo__t">Com IA, eu acelero</h3>
            <p>
              Hoje uso o Claude Code como copiloto. Eu escrevo o pedido com contexto, aprovo o plano, exijo testes e
              reviso o diff antes de publicar. A responsabilidade continua minha.
            </p>
            <ul aria-label="Como uso IA">
              <li>Pedido com contexto</li><li>Plano aprovado por mim</li><li>Testes antes do deploy</li><li>Revisão do diff</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="band wrap" aria-labelledby="rota-titulo">
        <h2 id="rota-titulo" className="display">Da logística ao código.</h2>
        <p className="lead">Seis anos fazendo mercadoria chegar no lugar certo me ensinaram a pensar em rotas, prazos e pessoas. É o mesmo jeito que eu uso para construir sistemas.</p>
        <RouteStory items={timeline} />
      </section>

      <section className="band wrap" aria-labelledby="projetos-titulo">
        <div className="band__head">
          <h2 id="projetos-titulo" className="display">Sistemas no ar, agora.</h2>
          <Link to="/projetos" className="arrow-link">Ver todos os casos</Link>
        </div>
        <ProjectGrid items={liveProjects} />
      </section>

      <section className="band band--dark" aria-labelledby="ia-titulo">
        <div className="wrap">
          <h2 id="ia-titulo" className="display">Como um pedido vira sistema.</h2>
          <ol className="steps">
            {workflow.map((w, i) => (
              <li key={w.step} className="step">
                <span className="step__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="step__t">{w.step}</h3>
                <p className="step__d">{w.text}</p>
              </li>
            ))}
          </ol>
          <Link to="/como-trabalho-com-ia" className="arrow-link arrow-link--dark">O que a IA faz e o que é responsabilidade minha</Link>
        </div>
      </section>

      <section className="band wrap contact-cta" aria-labelledby="cta-titulo">
        <h2 id="cta-titulo" className="display">Vamos conversar?</h2>
        <p>
          <Link to="/contato" className="btn btn--solid">Mandar mensagem</Link>
          <a href={`mailto:${profile.email}`} className="mono-link">{profile.email}</a>
        </p>
      </section>
    </div>
  );
}
