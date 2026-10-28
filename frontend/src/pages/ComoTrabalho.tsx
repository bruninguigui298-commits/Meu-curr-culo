import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { responsibilities, workflow } from '../lib/workflow';

export function ComoTrabalho() {
  useDocumentTitle('Como eu trabalho com IA');
  return (
    <div className="page">
      <div className="wrap">
        <p className="eyebrow">Como eu trabalho com IA</p>
        <h1 className="display">Eu dirijo, a IA acelera.</h1>
        <p className="lead">
          Em 2026 ninguém precisa fingir que não usa IA. O que importa é saber <em>como</em> usa: quem decide, quem
          confere e quem responde pelo resultado. Este é o meu fluxo real, o mesmo usado para construir este site.
        </p>
      </div>

      <section className="band band--dark" aria-labelledby="fluxo-titulo">
        <div className="wrap">
          <h2 id="fluxo-titulo" className="h2">O fluxo, do pedido ao deploy</h2>
          <ol className="flow">
            {workflow.map((w, i) => (
              <li key={w.step} className="flow__item">
                <span className="flow__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="flow__t">{w.step} <span className="flow__who">— {w.who}</span></h3>
                  <p>{w.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="resp-titulo">
        <h2 id="resp-titulo" className="h2">Quem faz o quê</h2>
        <div className="split">
          <div className="split__col">
            <h3 className="split__t">O que a IA faz</h3>
            <ul className="bullets">{responsibilities.ia.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="split__col split__col--me">
            <h3 className="split__t">O que é responsabilidade minha</h3>
            <ul className="bullets">{responsibilities.eu.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="padrao-titulo">
        <h2 id="padrao-titulo" className="h2">O padrão que eu repito em todo projeto</h2>
        <pre className="code" tabIndex={0} aria-label="Estrutura de pastas padrão">{`backend/
  src/config  database  domain  repositories
      services  controllers  routes  middlewares
      app.ts  container.ts  server.ts
  tests/          ← Vitest + PGlite (Postgres de verdade, em memória)
frontend/
  src/api  components  pages  hooks  lib
database/         ← SQL puro, versionado
docs/             ← brief, decisões, licenças`}</pre>
        <p>
          Repetir a mesma estrutura é o que me deixa revisar rápido o que a IA escreve: eu sei onde cada coisa deve
          estar, então percebo quando algo está fora do lugar.
        </p>
        <h3 className="h3">Checklist antes de todo PR</h3>
        <ul className="checklist">
          <li>Testes passando e build sem erro</li>
          <li>Política de privacidade, termos e aviso de cookies (só essenciais)</li>
          <li>Formulário do titular (LGPD art. 18) com protocolo</li>
          <li>Coletar só o necessário; nada de rastreador de terceiros</li>
          <li>Acessibilidade: textos alternativos, contraste ≥ 4,5:1, teclado, foco visível, axe sem erros</li>
          <li>Sem promessas falsas: nada de métricas, clientes ou depoimentos inventados</li>
        </ul>
        <p>
          <Link to="/projetos" className="arrow-link">Veja o resultado nos projetos no ar →</Link>
        </p>
      </section>
    </div>
  );
}
