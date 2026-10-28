/**
 * Portfólio. Só fatos verificáveis (docs/BRIEF.md): nada de métricas, clientes ou depoimentos inventados.
 * `lessons` (o que deu errado e como resolveu) fica vazio até o Bruno escrever com as palavras dele.
 * Os slugs precisam bater com backend/src/domain/projects.ts (status ao vivo).
 */
export interface Project {
  slug: string;
  name: string;
  kind: string;
  url: string | null;
  urlNote?: string;
  summary: string;
  problem: string;
  features: string[];
  decisions: string[];
  lessons: string[];
  stack: string[];
  role: string;
  code: string;
  academic?: boolean;
  /** Prints: arquivos em public/projetos/<slug>/ */
  shots: { src: string; alt: string }[];
}

const base = ['Node.js', 'TypeScript', 'Express', 'React + Vite', 'Vitest', 'Render'];
const camadas = 'Backend em camadas (rotas → controllers → services → repositórios), validação com zod e testes antes do deploy.';

export const projects: Project[] = [
  {
    slug: 'red-autos',
    name: 'Red Autos',
    kind: 'Site + painel',
    url: 'https://red-autos.onrender.com',
    summary: 'Site de seminovos com painel admin, fotos, LGPD e abertura animada.',
    problem: 'Uma loja de seminovos precisa mostrar o estoque com fotos e manter tudo atualizado sem depender de outra pessoa para mexer no site.',
    features: ['Vitrine de veículos com fotos', 'Painel admin para cadastrar e editar o estoque', 'Páginas e fluxos de LGPD', 'Abertura animada: um carro com as rodas girando'],
    decisions: [camadas, 'Painel administrativo próprio, para o dono atualizar o estoque sozinho.', 'LGPD tratada desde o começo, não como remendo no fim.'],
    lessons: [],
    stack: [...base, 'SQL puro'],
    role: 'Construí do zero com o Claude Code como copiloto: defini escopo, revisei, testei e publiquei.',
    code: 'Repositório privado — o sistema está no ar para ver funcionando.',
    shots: [],
  },
  {
    slug: 'mensalli',
    name: 'Mensalli',
    kind: 'SaaS',
    url: 'https://mensalli.onrender.com',
    summary: 'SaaS de mensalidades: Pix copia e cola gerado localmente, lembretes por WhatsApp e assinatura pelo Mercado Pago.',
    problem: 'Quem cobra mensalidade (aulas, academias, serviços) perde tempo lembrando cliente por cliente e conferindo quem pagou.',
    features: ['Cadastro de clientes e mensalidades', 'Pix copia e cola gerado no próprio sistema', 'Lembretes por WhatsApp', 'Assinatura do SaaS pelo Mercado Pago'],
    decisions: [camadas, 'O código Pix copia e cola é gerado localmente, no servidor, sem depender de serviço de terceiros para isso.', 'A cobrança da assinatura do próprio SaaS fica com o Mercado Pago.'],
    lessons: [],
    stack: [...base, 'SQL puro', 'Mercado Pago'],
    role: 'Construí do zero com o Claude Code como copiloto: defini escopo, revisei, testei e publiquei.',
    code: 'Repositório privado — o sistema está no ar para ver funcionando.',
    shots: [],
  },
  {
    slug: 'lions-expedicao',
    name: 'Lions Expedição',
    kind: 'Sistema logístico',
    url: 'https://expedicao-itdc.onrender.com',
    summary: 'NF-e → romaneio → rota → rastreio, com app do motorista (PWA), PostGIS e mapas.',
    problem: 'Do pedido faturado até a entrega existem várias etapas soltas: nota, romaneio, rota e acompanhamento. O sistema junta tudo num fluxo só.',
    features: ['Entrada pela NF-e', 'Montagem de romaneio', 'Rota no mapa', 'Rastreio da entrega', 'App do motorista instalável (PWA)'],
    decisions: [camadas, 'PostGIS para guardar e consultar dados geográficos direto no PostgreSQL.', 'App do motorista como PWA: instala pelo navegador, sem loja de aplicativos.'],
    lessons: [],
    stack: [...base, 'PostgreSQL + PostGIS', 'PWA', 'Mapas'],
    role: 'Construí com o Claude Code como copiloto, dentro da Lions Company.',
    code: 'Repositório privado — o sistema está no ar para ver funcionando.',
    shots: [],
  },
  {
    slug: 'lions-rh',
    name: 'Lions RH',
    kind: 'Sistema de RH',
    url: 'https://lions-rh.onrender.com',
    summary: 'RH online: recrutamento, vagas públicas, onboarding e segurança reforçada.',
    problem: 'Recrutar e integrar pessoas costuma acontecer em planilhas, e-mails e mensagens soltas — com dados pessoais espalhados.',
    features: ['Vagas públicas', 'Recrutamento', 'Onboarding de quem entra', 'Segurança reforçada para dados pessoais'],
    decisions: [camadas, 'Segurança tratada como requisito, porque o sistema guarda dados de candidatos e funcionários.'],
    lessons: [],
    stack: [...base, 'SQL puro'],
    role: 'Construí com o Claude Code como copiloto, dentro da Lions Company.',
    code: 'Repositório privado — o sistema está no ar para ver funcionando.',
    shots: [],
  },
  {
    slug: 'lions-leads',
    name: 'Lions Leads',
    kind: 'Captação de leads',
    url: 'https://lions-leads.onrender.com',
    summary: 'Formulário em formato de conversa, rodízio de vendedores e LGPD com criptografia.',
    problem: 'Formulário longo afasta o cliente, e lead que chega sem dono esfria. Este sistema facilita a entrada e distribui o contato.',
    features: ['Formulário em formato de conversa', 'Rodízio automático entre vendedores', 'Dados pessoais criptografados (LGPD)'],
    decisions: [camadas, 'Rodízio de vendedores para nenhum lead ficar parado.', 'Criptografia dos dados pessoais guardados.'],
    lessons: [],
    stack: [...base, 'SQL puro', 'Criptografia'],
    role: 'Construí com o Claude Code como copiloto, dentro da Lions Company.',
    code: 'Repositório privado — o sistema está no ar para ver funcionando.',
    shots: [],
  },
  {
    slug: 'site-lions-company',
    name: 'Site Lions Company',
    kind: 'Site institucional',
    url: 'https://lions-aep7.onrender.com',
    summary: 'Site institucional com uma rede de pontos que forma o leão e se transforma ao rolar a página.',
    problem: 'A Lions Company precisava de uma apresentação que mostrasse, logo de cara, que sabe fazer coisa diferente.',
    features: ['Rede de pontos animada que forma o leão', 'Transformação ligada à rolagem da página'],
    decisions: ['Animação como identidade da marca, não só enfeite.'],
    lessons: [],
    stack: ['React + Vite', 'TypeScript', 'Animação ligada à rolagem', 'Render'],
    role: 'Construí com o Claude Code como copiloto.',
    code: 'Repositório privado — o site está no ar para ver funcionando.',
    shots: [],
  },
  {
    slug: 'liondevs',
    name: 'LionDevs',
    kind: 'Sistema interno',
    url: 'https://liondevs.onrender.com',
    urlNote: 'Acesso com login (uso interno).',
    summary: 'Sistema interno: cotação → PDF → assinatura eletrônica → pedido → nota.',
    problem: 'O caminho entre orçar e faturar passa por vários documentos. O sistema transforma isso numa sequência única.',
    features: ['Cotação', 'Geração de PDF', 'Assinatura eletrônica', 'Pedido', 'Nota'],
    decisions: [camadas, 'Um fluxo linear, em que cada etapa nasce da anterior, para não redigitar dados.'],
    lessons: [],
    stack: [...base, 'SQL puro', 'Geração de PDF'],
    role: 'Construí com o Claude Code como copiloto, dentro da Lions Company.',
    code: 'Repositório privado; a página no ar pede login.',
    shots: [],
  },
  {
    slug: 'mossplay',
    name: 'MossPlay',
    kind: 'Projeto acadêmico',
    url: 'https://mossplay.onrender.com',
    academic: true,
    summary: 'Projeto acadêmico: plataforma de jogos com pontos fictícios e poker/truco multiplayer em tempo real.',
    problem: 'Projeto de curso para praticar tempo real: várias pessoas jogando juntas, com o estado da partida sincronizado.',
    features: ['Poker e truco multiplayer em tempo real', 'Pontos fictícios (sem dinheiro de verdade)', 'Salas e partidas sincronizadas'],
    decisions: ['socket.io para a comunicação em tempo real.', 'Prisma como camada de acesso ao banco neste projeto.', 'Pontuação só fictícia: é um projeto de estudo.'],
    lessons: [],
    stack: ['Node.js', 'TypeScript', 'socket.io', 'Prisma', 'React + Vite', 'Render'],
    role: 'Projeto acadêmico, feito com o Claude Code como copiloto.',
    code: 'Projeto acadêmico.',
    shots: [],
  },
  {
    slug: 'saas-restaurante',
    name: 'SaaS Restaurante',
    kind: 'Contribuição',
    url: null,
    urlNote: 'Projeto privado do Kaique — sem link público.',
    summary: 'Contribuição no projeto do Kaique: estoque PVPS, pedidos de compra em PDF, delivery e relatórios.',
    problem: 'Restaurante perde dinheiro com estoque vencido e compra desorganizada.',
    features: ['Estoque PVPS (primeiro que vence, primeiro que sai)', 'Pedidos de compra em PDF', 'Delivery', 'Relatórios'],
    decisions: ['Contribuí em partes do sistema de outro desenvolvedor, seguindo o padrão do projeto dele.'],
    lessons: [],
    stack: ['Node.js', 'TypeScript', 'SQL'],
    role: 'Contribuição em projeto do Kaique (Lions Company).',
    code: 'Privado.',
    shots: [],
  },
];

export const liveProjects = projects.filter((p) => p.url);

export function findProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
