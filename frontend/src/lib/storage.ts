/** localStorage/sessionStorage podem falhar (modo privado, bloqueio): nunca quebrar o site por isso. */
export function readStore(kind: 'local' | 'session', key: string): string | null {
  try {
    return (kind === 'local' ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

export function writeStore(kind: 'local' | 'session', key: string, value: string) {
  try {
    (kind === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value);
  } catch {
    /* sem armazenamento: segue sem lembrar */
  }
}
