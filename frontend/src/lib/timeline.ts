export interface TimelineItem {
  title: string;
  when: string | null;
  text: string;
}

/** Datas exatas pendentes com o Bruno: `when: null` não mostra data. */
export const timeline: TimelineItem[] = [
  {
    title: 'Área comercial',
    when: null,
    text: 'Onde aprendi a ouvir o cliente, negociar e resolver problema de verdade. É daí que vem o meu jeito de começar qualquer sistema: entendendo para quem ele é.',
  },
  {
    title: 'Curso de Desenvolvimento Back-end',
    when: null,
    text: 'Migrei para tecnologia. Node.js, TypeScript, SQL, APIs, testes. Estou na fase final do curso.',
  },
  {
    title: 'Primeiros sistemas com IA',
    when: '2026',
    text: 'Comecei a construir com o Claude Code como copiloto: backend em camadas, testes e deploy. Oito sistemas estão no ar hoje.',
  },
  {
    title: 'Lions Company',
    when: null,
    text: 'Faço parte da Lions Company com o Kaique: sites, sistemas e automação para empresas.',
  },
];
