import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { hostOf } from '../lib/format';
import { profile, skills } from '../lib/profile';
import { projects } from '../lib/projects';

/** Versão recrutador: limpa, uma coluna, cabe em A4 (salvar como PDF pelo navegador). */
export function Curriculo() {
  useDocumentTitle('Currículo');
  const edu = profile.education;
  return (
    <div className="cv-page">
      <div className="cv-actions wrap">
        <p>Versão para recrutadores. Para salvar em PDF, use "Imprimir" e escolha "Salvar como PDF".</p>
        <button type="button" className="btn btn--solid" onClick={() => window.print()}>Imprimir / salvar PDF</button>
      </div>
      <article className="cv" aria-labelledby="cv-nome">
        <header className="cv__head">
          <div>
            <h1 id="cv-nome" className="cv__name">{profile.name}</h1>
            <p className="cv__role">{profile.role} · {profile.age} anos · {profile.location}</p>
          </div>
          <ul className="cv__contacts">
            <li>{profile.email}</li>
            <li>linkedin.com/in/bruno-pereira-5727ba238</li>
            <li>github.com/bruninguigui298-commits</li>
            {profile.phone && <li>{profile.phone.display}</li>}
          </ul>
        </header>

        <section>
          <h2>Resumo</h2>
          <p>
            Desenvolvedor back-end formado pelo SENAI, vindo da logística e da área comercial. Programo sozinho e hoje trabalho com vibe coding (Claude Code
            como copiloto): eu defino o escopo, reviso cada mudança, exijo testes e publico. Oito sistemas no ar, com backend em camadas
            (Node.js, TypeScript, Express, SQL puro), testes com Vitest e deploy no Render. Trago da experiência comercial a
            comunicação, a negociação e o foco no problema do cliente.
          </p>
        </section>

        <section>
          <h2>Projetos</h2>
          <ul className="cv__projects">
            {projects.map((p) => (
              <li key={p.slug}>
                <strong>{p.name}</strong> — {p.summary}
                {p.url ? <span className="cv__url"> {hostOf(p.url)}</span> : <span className="cv__url"> (privado)</span>}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Experiência</h2>
          <ul className="cv__list">
            <li><strong>{profile.company.name}</strong> — {profile.company.what}, com o {profile.company.partner}. Projetos acima.</li>
            <li>
              <strong>Luitex Máquinas e Ferramentas</strong> —{' '}
              {profile.experience.map((e) => `${e.role} (${e.period})`).join(' · ')}. Atendimento ao cliente, organização,
              trabalho em equipe e resolução de problemas.
            </li>
          </ul>
        </section>

        <section>
          <h2>Formação</h2>
          <p>
            <strong>{edu.course}</strong> — {edu.institution} · {edu.hours} h · {edu.period} · {edu.status}
          </p>
          <p className="cv__cert">Certificado verificável: {edu.certificateUrl.replace(/^https:\/\//, '')}</p>
          <p>{edu.highSchool}</p>
        </section>

        <section>
          <h2>Competências</h2>
          <p><strong>Back-end:</strong> {skills.backend.join(', ')}.</p>
          <p><strong>Front-end:</strong> {skills.frontend.join(', ')}.</p>
          <p><strong>Qualidade e entrega:</strong> {[...skills.qualidade, ...skills.entrega].join(', ')}.</p>
          <p><strong>IA:</strong> {skills.ia.join(', ')}.</p>
        </section>

        <section>
          <h2>Idiomas</h2>
          <p>{profile.languages.map((l) => `${l.name} — ${l.level}`).join(' · ')}</p>
        </section>
      </article>
    </div>
  );
}
