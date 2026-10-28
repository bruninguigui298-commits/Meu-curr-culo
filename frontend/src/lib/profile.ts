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
  location: 'Sumaré/SP',
  email: 'bruno12pereira472@gmail.com',
  linkedin: 'https://www.linkedin.com/in/bruno-pereira-5727ba238/',
  github: 'https://github.com/bruninguigui298-commits',
  /** Telefone/WhatsApp: só publicar com autorização do Bruno. */
  phone: null as string | null,
  /** Foto: coloque o arquivo em frontend/public/fotos/ e o caminho aqui, ex.: '/fotos/bruno.jpg'. */
  photo: null as { src: string; alt: string } | null,
  /** Vídeo de apresentação (60–90 s): arquivo em public/video/ + legendas .vtt. */
  video: null as { src: string; captions: string; poster?: string } | null,
  /** Fonte: certificado do SENAI enviado pelo Bruno (não publicar o PDF: ele tem o RG). */
  education: {
    course: 'Desenvolvedor Back-end',
    institution: 'SENAI "Dr. Celso Charuri" — Sumaré/SP',
    hours: 160,
    period: 'mai/2026 – out/2026',
    status: 'Concluído',
    highSchool: 'Ensino Médio completo',
  },
  /** Fonte: currículo em PDF enviado pelo Bruno. */
  experience: [
    { company: 'Luitex Máquinas e Ferramentas', role: 'Vendedor', period: '2025 – atual' },
    { company: 'Luitex Máquinas e Ferramentas', role: 'Auxiliar de Logística', period: '2019 – 2025' },
    { company: 'Luitex Máquinas e Ferramentas', role: 'Jovem Aprendiz', period: '2019' },
  ],
  languages: [
    { name: 'Português', level: 'nativo' },
    { name: 'Inglês', level: 'básico (em desenvolvimento)' },
  ],
  company: { name: 'Lions Company', what: 'sites, sistemas e automação', partner: 'Kaique' },
} as const;

export const skills = {
  backend: ['Node.js', 'TypeScript', 'Express', 'SQL puro (PostgreSQL e MySQL)', 'zod', 'Prisma (MossPlay)', 'socket.io', 'APIs REST', 'Modelagem entidade-relacionamento'],
  frontend: ['React + Vite', 'HTML e CSS', 'JavaScript', 'Tailwind', 'PWA'],
  qualidade: ['Vitest', 'PGlite para testar SQL de verdade', 'Checklist LGPD', 'Acessibilidade (WCAG AA)'],
  entrega: ['Git e GitHub (branch + PR por parte)', 'Render', 'Neon / Aiven (bancos gerenciados)'],
  ia: ['Claude Code como copiloto', 'Prompts com contexto e critérios de aceite', 'Revisão de diff linha a linha'],
  pessoas: ['Atendimento ao cliente', 'Comunicação', 'Negociação', 'Organização', 'Trabalho em equipe', 'Resolução de problemas'],
};
