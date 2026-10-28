export interface TimelineItem {
  title: string;
  when: string | null;
  text: string;
}

/** Fonte: currículo e certificado enviados pelo Bruno. */
export const timeline: TimelineItem[] = [
  {
    title: 'Luitex: Jovem Aprendiz',
    when: '2019',
    text: 'Primeiro emprego, na Luitex Máquinas e Ferramentas.',
  },
  {
    title: 'Auxiliar de Logística',
    when: '2019 – 2025',
    text: 'Seis anos na logística da Luitex: organização, prazos e o dia a dia de fazer a mercadoria chegar certa.',
  },
  {
    title: 'Vendedor',
    when: '2025 – atual',
    text: 'Na área comercial da Luitex: atender, negociar e resolver o problema do cliente. É daí que vem o meu jeito de começar qualquer sistema: entendendo para quem ele é.',
  },
  {
    title: 'Desenvolvedor Back-end — SENAI',
    when: 'mai – out/2026',
    text: 'Curso de 160 horas no SENAI de Sumaré, concluído: APIs, banco de dados (modelagem, DDL e DML), segurança, código limpo e implantação.',
  },
  {
    title: 'Primeiros sistemas com IA',
    when: '2026',
    text: 'Comecei a construir com o Claude Code como copiloto: backend em camadas, testes e deploy. Oito sistemas estão no ar hoje.',
  },
  {
    title: 'Lions Company',
    when: '2026',
    text: 'Faço parte da Lions Company com o Kaique: sites, sistemas e automação para empresas.',
  },
];
