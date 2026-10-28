import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { ProjectStatus, StatusSnapshot } from '../api/types';

let shared: Promise<StatusSnapshot> | null = null;
let sharedAt = 0;

/** Uma consulta por visita (o servidor ainda guarda em cache por 5 min). */
function load(): Promise<StatusSnapshot> {
  if (!shared || Date.now() - sharedAt > 60_000) {
    sharedAt = Date.now();
    shared = api<StatusSnapshot>('/projetos/status').catch((e) => {
      shared = null;
      throw e;
    });
  }
  return shared;
}

export type StatusResult =
  | { loading: true; error: false; snapshot: null }
  | { loading: false; error: true; snapshot: null }
  | { loading: false; error: false; snapshot: StatusSnapshot };

export function useProjectStatus(): StatusResult & { bySlug: (slug: string) => ProjectStatus | undefined } {
  const [result, setResult] = useState<StatusResult>({ loading: true, error: false, snapshot: null });
  useEffect(() => {
    let alive = true;
    load().then(
      (snapshot) => alive && setResult({ loading: false, error: false, snapshot }),
      () => alive && setResult({ loading: false, error: true, snapshot: null }),
    );
    return () => {
      alive = false;
    };
  }, []);
  return { ...result, bySlug: (slug) => result.snapshot?.projects.find((p) => p.slug === slug) };
}
