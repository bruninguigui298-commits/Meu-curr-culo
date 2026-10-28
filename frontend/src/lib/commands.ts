import { profile } from './profile';
import { liveProjects } from './projects';

/** Respostas do terminal "pergunte sobre mim". Texto escrito à mão: nada de IA externa, nada é enviado. */
export interface Answer {
  text: string;
  links?: { label: string; to: string; external?: boolean }[];
}

export const COMMANDS: Record<string, () => Answer> = {
  ajuda: () => ({
    text: 'Comandos: sobre, programo, ia, projetos, stack, formacao, experiencia, contato, limpar.',
  }),
  sobre: () => ({
    text: `${profile.name}, ${profile.age} anos, de ${profile.location}. Comecei como jovem aprendiz, passei seis anos na logística, hoje estou nas vendas e me formei Desenvolvedor Back-end no SENAI.`,
    links: [{ label: 'Ler mais sobre mim', to: '/sobre' }],
  }),
  programo: () => ({
    text: 'Sei programar sem IA: lógica, JavaScript, Node.js, SQL e APIs REST, que aprendi no SENAI e pratico nos meus projetos. Leio e entendo o código que publico.',
  }),
  ia: () => ({
    text: 'Hoje eu faço vibe coding com o Claude Code: escrevo o pedido com contexto, decido o plano, a IA escreve junto e eu reviso, testo e publico.',
    links: [{ label: 'Ver o fluxo completo', to: '/como-trabalho-com-ia' }],
  }),
  projetos: () => ({
    text: `${liveProjects.length} sistemas no ar: ${liveProjects.map((p) => p.name).join(', ')}.`,
    links: [{ label: 'Abrir o painel de projetos', to: '/projetos' }],
  }),
  stack: () => ({
    text: 'Node.js, TypeScript, Express, SQL puro (PostgreSQL e MySQL), zod, React + Vite, Vitest, Git e GitHub, Render.',
  }),
  formacao: () => ({
    text: `${profile.education.course} pelo ${profile.education.institution}, ${profile.education.hours} horas, concluído em out/2026. ${profile.education.highSchool}.`,
    links: [{ label: 'Verificar certificado no SENAI', to: profile.education.certificateUrl, external: true }],
  }),
  experiencia: () => ({
    text: profile.experience.map((e) => `${e.role} na ${e.company} (${e.period})`).join('; ') + '.',
  }),
  contato: () => ({
    text: `E-mail: ${profile.email}${profile.phone ? ` · Telefone: ${profile.phone.display}` : ''}`,
    links: [
      { label: 'Mandar mensagem', to: '/contato' },
      { label: 'LinkedIn', to: profile.linkedin, external: true },
    ],
  }),
};

const ALIASES: Record<string, string> = {
  help: 'ajuda', '?': 'ajuda', formação: 'formacao', experiência: 'experiencia', 'quem é você': 'sobre', quem: 'sobre',
  projeto: 'projetos', email: 'contato', 'e-mail': 'contato', telefone: 'contato', vibe: 'ia', 'vibe coding': 'ia', código: 'programo', codigo: 'programo',
};

export const SUGGESTED = ['sobre', 'programo', 'ia', 'projetos', 'contato'];

export function runCommand(raw: string): Answer | 'limpar' {
  const cmd = raw.trim().toLowerCase().replace(/^\//, '');
  if (cmd === 'limpar' || cmd === 'clear') return 'limpar';
  const key = COMMANDS[cmd] ? cmd : ALIASES[cmd];
  if (key) return COMMANDS[key]();
  return { text: `Não conheço "${raw.trim()}". Digite "ajuda" para ver os comandos.` };
}
