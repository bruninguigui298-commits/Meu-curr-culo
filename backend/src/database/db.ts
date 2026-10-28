/** Interface mínima de banco: SQL puro com parâmetros. Implementada por `pg` e por PGlite. */
export interface Db {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
  /** Executa um script com vários comandos (migrações). */
  exec(sql: string): Promise<void>;
  close(): Promise<void>;
}
