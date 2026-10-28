import { readFileSync } from 'node:fs';
import path from 'node:path';

const backendFile = (f: string) => readFileSync(path.join(process.cwd(), '..', 'backend', 'src', 'domain', f), 'utf8');
import { describe, expect, it } from 'vitest';
import { projects } from './projects';
import { LGPD_TYPES } from './lgpd';

describe('conteúdo', () => {
  it('slugs únicos e iguais aos monitorados pelo backend', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const backend = backendFile('projects.ts');
    const monitored = [...backend.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
    expect(monitored.sort()).toEqual(projects.filter((p) => p.url).map((p) => p.slug).sort());
  });

  it('tipos de pedido LGPD batem com o backend', () => {
    const backend = backendFile('lgpd.ts');
    for (const key of Object.keys(LGPD_TYPES)) expect(backend).toContain(`${key}:`);
  });

  it('projetos no ar usam https e o MossPlay é descrito como acadêmico, sem apostas', () => {
    for (const p of projects) if (p.url) expect(p.url).toMatch(/^https:\/\//);
    const moss = projects.find((p) => p.slug === 'mossplay')!;
    expect(moss.academic).toBe(true);
    expect(JSON.stringify(moss).toLowerCase()).not.toMatch(/aposta|dinheiro real|cassino/);
  });
});
