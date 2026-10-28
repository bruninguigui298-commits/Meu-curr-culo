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

export interface StatusSnapshot {
  checkedAt: string;
  cacheSeconds: number;
  projects: ProjectStatus[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  consentVersion: string;
  consentAt: string;
  createdAt: string;
  readAt: string | null;
}

export type LgpdStatus = 'recebido' | 'em_andamento' | 'concluido' | 'recusado';

export interface LgpdRequest {
  id: number;
  protocol: string;
  name: string;
  email: string;
  requestType: string;
  details: string | null;
  status: LgpdStatus;
  createdAt: string;
  updatedAt: string;
}
