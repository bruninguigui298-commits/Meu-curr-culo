import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Funciona tanto em src/ (tsx) quanto em dist/ (build): os dois ficam a 2 níveis de backend/.
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..', '..');

export const paths = {
  sqlDir: path.join(repoRoot, 'database'),
  frontendDist: path.join(repoRoot, 'frontend', 'dist'),
};
