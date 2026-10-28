/**
 * Dados do Bruno. Tudo aqui vem dos READMEs dele e do brief (docs/BRIEF.md).
 * Campos `null` estão pendentes: o site esconde o que não foi confirmado.
 */
export const profile = {
  name: 'Bruno Pereira Bento',
  shortName: 'Bruno',
  age: 25,
  role: 'Desenvolvedor back-end',
  tagline: 'Eu dirijo, a IA acelera.',
  /** Pendente: confirmar cidade com o Bruno. Enquanto isso, só o país. */
  location: 'Brasil',
  email: 'bruno12pereira472@gmail.com',
  linkedin: 'https://www.linkedin.com/in/bruno-pereira-5727ba238/',
  github: 'https://github.com/bruninguigui298-commits',
  /** Telefone/WhatsApp: só publicar com autorização do Bruno. */
  phone: null as string | null,
  /** Foto: coloque o arquivo em frontend/public/fotos/ e o caminho aqui, ex.: '/fotos/bruno.jpg'. */
  photo: null as { src: string; alt: string } | null,
  /** Vídeo de apresentação (60–90 s): arquivo em public/video/ + legendas .vtt. */
  video: null as { src: string; captions: string; poster?: string } | null,
  education: {
    course: 'Desenvolvimento Back-end',
    status: 'Em fase final',
    /** Pendentes: instituição e previsão de conclusão. */
    institution: null as string | null,
    expected: null as string | null,
  },
  company: { name: 'Lions Company', what: 'sites, sistemas e automação', partner: 'Kaique' },
} as const;

export const skills = {
  backend: ['Node.js', 'TypeScript', 'Express', 'SQL puro (PostgreSQL e MySQL)', 'zod', 'Prisma (MossPlay)', 'socket.io'],
  frontend: ['React + Vite', 'Tailwind', 'PWA'],
  qualidade: ['Vitest', 'PGlite para testar SQL de verdade', 'Checklist LGPD', 'Acessibilidade (WCAG AA)'],
  entrega: ['Git e GitHub (branch + PR por parte)', 'Render', 'Neon / Aiven (bancos gerenciados)'],
  ia: ['Claude Code como copiloto', 'Prompts com contexto e critérios de aceite', 'Revisão de diff linha a linha'],
  pessoas: ['Comunicação', 'Negociação', 'Resolução de problemas', 'Entender o problema do cliente antes do código'],
};
