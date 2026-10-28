import { describe, expect, it } from 'vitest';
import { COMMANDS, runCommand } from './commands';

describe('terminal "pergunte sobre mim"', () => {
  it('todo comando responde texto não vazio', () => {
    for (const k of Object.keys(COMMANDS)) expect(runCommand(k)).toMatchObject({ text: expect.stringMatching(/\S/) });
  });

  it('aceita maiúsculas, barra e apelidos', () => {
    expect(runCommand('  SOBRE ')).toEqual(COMMANDS.sobre());
    expect(runCommand('/projetos')).toEqual(COMMANDS.projetos());
    expect(runCommand('vibe coding')).toEqual(COMMANDS.ia());
    expect(runCommand('limpar')).toBe('limpar');
  });

  it('comando desconhecido orienta a digitar ajuda', () => {
    expect(runCommand('xyz')).toMatchObject({ text: expect.stringContaining('ajuda') });
  });

  it('deixa claro que o Bruno programa sem IA e usa vibe coding', () => {
    expect(COMMANDS.programo().text).toMatch(/sem IA/);
    expect(COMMANDS.ia().text).toMatch(/vibe coding/);
  });
});
