import { Link } from 'react-router-dom';
import { PhotoSlot } from '../components/PhotoSlot';
import { VideoSlot } from '../components/VideoSlot';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { profile, skills } from '../lib/profile';

const SKILL_LABELS: Record<keyof typeof skills, string> = {
  backend: 'Back-end',
  frontend: 'Front-end',
  qualidade: 'Qualidade',
  entrega: 'Entrega',
  ia: 'Trabalho com IA',
  pessoas: 'Da área comercial',
};

export function Sobre() {
  useDocumentTitle('Sobre');
  return (
    <div className="wrap page">
      <p className="eyebrow">Sobre</p>
      <div className="about">
        <div className="about__text">
          <h1 className="display">Oi, eu sou o Bruno.</h1>
          <p className="lead">
            Tenho {profile.age} anos e sou de {profile.location}. Trabalho desde 2019 na Luitex Máquinas e Ferramentas:
            comecei como jovem aprendiz, passei seis anos na logística e hoje estou nas vendas — atendendo, negociando e
            resolvendo problema de cliente. Em 2026 concluí o curso de {profile.education.course} no SENAI
            ({profile.education.hours} horas) e comecei a construir sistemas de verdade.
          </p>
          <p>
            <strong>Sei programar sozinho</strong>: lógica, JavaScript, Node.js, SQL e APIs são a minha base. E hoje eu
            também sou <strong>vibe coder</strong>, e falo isso abertamente: uso IA (o Claude Code) como copiloto para
            ir mais rápido. Isso não quer dizer "a IA faz e eu publico". Quer dizer que eu escrevo o pedido com contexto, decido o plano, leio o
            que foi gerado, exijo testes, passo o checklist de LGPD e acessibilidade e só então faço o deploy. Quem
            responde pelo que está no ar sou eu.
          </p>
          <p>
            Faço parte da <strong>{profile.company.name}</strong>, com o {profile.company.partner}: {profile.company.what}.
            Estou buscando uma oportunidade como desenvolvedor, onde eu possa somar a visão de quem já esteve do lado do
            cliente com a velocidade de quem constrói com IA.
          </p>
          <p>
            <Link to="/projetos" className="arrow-link">Veja o que já está no ar →</Link>
          </p>
        </div>
        <PhotoSlot size={280} />
      </div>

      <VideoSlot />

      <section aria-labelledby="formacao-titulo" className="section">
        <h2 id="formacao-titulo" className="h2">Formação</h2>
        <div className="edu">
          <p className="edu__course">{profile.education.course}</p>
          <p className="muted">
            {profile.education.institution} · {profile.education.hours} horas · {profile.education.period} ·{' '}
            {profile.education.status}
          </p>
          <p>
            <a href={profile.education.certificateUrl} target="_blank" rel="noopener noreferrer">
              Verificar o certificado no site do SENAI ↗<span className="sr-only"> (abre em nova aba)</span>
            </a>
          </p>
          <p className="muted">
            {profile.education.highSchool} · Idiomas: {profile.languages.map((l) => `${l.name} ${l.level}`).join(', ')}
          </p>
        </div>
      </section>

      <section aria-labelledby="skills-titulo" className="section">
        <h2 id="skills-titulo" className="h2">O que eu uso</h2>
        <div className="skills">
          {(Object.keys(skills) as (keyof typeof skills)[]).map((k) => (
            <div key={k} className="skills__group">
              <h3 className="skills__t">{SKILL_LABELS[k]}</h3>
              <ul className="tags">
                {skills[k].map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
