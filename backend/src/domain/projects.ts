/**
 * Projetos verificados pelo status ao vivo. O conteúdo das páginas de caso fica no frontend
 * (`frontend/src/lib/projects.ts`); aqui só o que o servidor precisa para consultar.
 * Os slugs precisam ser iguais nos dois lados.
 */
export interface MonitoredProject {
  slug: string;
  name: string;
  url: string;
  /** Caminho consultado primeiro. Se responder 404, consulta a página inicial. */
  healthPath: string;
}

export const MONITORED_PROJECTS: MonitoredProject[] = [
  { slug: 'red-autos', name: 'Red Autos', url: 'https://red-autos.onrender.com', healthPath: '/health' },
  { slug: 'mensalli', name: 'Mensalli', url: 'https://mensalli.onrender.com', healthPath: '/health' },
  { slug: 'lions-expedicao', name: 'Lions Expedição', url: 'https://expedicao-itdc.onrender.com', healthPath: '/health' },
  { slug: 'lions-rh', name: 'Lions RH', url: 'https://lions-rh.onrender.com', healthPath: '/health' },
  { slug: 'lions-leads', name: 'Lions Leads', url: 'https://lions-leads.onrender.com', healthPath: '/health' },
  { slug: 'site-lions-company', name: 'Site Lions Company', url: 'https://lions-aep7.onrender.com', healthPath: '/health' },
  { slug: 'liondevs', name: 'LionDevs', url: 'https://liondevs.onrender.com', healthPath: '/health' },
  { slug: 'mossplay', name: 'MossPlay', url: 'https://mossplay.onrender.com', healthPath: '/health' },
];

export type ProjectState = 'no_ar' | 'instavel' | 'sem_resposta';

export interface ProjectStatus {
  slug: string;
  name: string;
  url: string;
  state: ProjectState;
  httpStatus: number | null;
  responseMs: number | null;
  checkedAt: string;
}
