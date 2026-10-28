import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { runCommand, SUGGESTED, type Answer } from '../lib/commands';
import { readStore, writeStore } from '../lib/storage';

export const PROMPT =
  'monta meu currículo: claro, honesto, mostrando que eu programo com IA e provando com os sistemas que estão no ar.';

export const STEPS = [
  'plano aprovado pelo Bruno',
  'título e apresentação',
  'backend em camadas + testes',
  'status ao vivo dos projetos',
  'revisado, testado e publicado',
];

/** Etapa final: tudo visível. */
export const FINAL_STAGE = STEPS.length;
const SEEN_KEY = 'bp-intro-vista';

/**
 * Controla a abertura "que se constrói". Cada etapa concluída libera uma parte da página.
 * Pula direto para o fim se: reduced-motion, já viu nesta sessão, ou clicou em "Pular".
 */
export function useBuildIntro() {
  const reduced = useReducedMotion();
  const [skipped, setSkipped] = useState(() => readStore('session', SEEN_KEY) === '1');
  const [typed, setTyped] = useState(0);
  const [stage, setStage] = useState(0);
  const instant = reduced || skipped;

  useEffect(() => {
    if (instant) return;
    if (typed < PROMPT.length) {
      const t = setTimeout(() => setTyped((n) => Math.min(PROMPT.length, n + 2)), 22);
      return () => clearTimeout(t);
    }
    if (stage < FINAL_STAGE) {
      const t = setTimeout(() => setStage((s) => s + 1), stage === 0 ? 350 : 650);
      return () => clearTimeout(t);
    }
    writeStore('session', SEEN_KEY, '1');
  }, [instant, typed, stage]);

  const skip = useCallback(() => {
    writeStore('session', SEEN_KEY, '1');
    setSkipped(true);
  }, []);

  return {
    typed: instant ? PROMPT.length : typed,
    stage: instant ? FINAL_STAGE : stage,
    done: instant || stage >= FINAL_STAGE,
    skip,
  };
}

interface Props {
  typed: number;
  stage: number;
  done: boolean;
  onSkip: () => void;
}

export function BuildIntro({ typed, stage, done, onSkip }: Props) {
  const footRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const skipFocused = useRef(false);
  const [log, setLog] = useState<{ cmd: string; answer: Answer }[]>([]);
  const [value, setValue] = useState('');

  // O botão some ao pular: o foco vai para a área do terminal em vez de se perder.
  useEffect(() => {
    if (done && skipFocused.current) footRef.current?.focus();
  }, [done]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el && log.length) el.scrollTop = el.scrollHeight;
  }, [log]);

  function ask(cmd: string) {
    if (!cmd.trim()) return;
    const answer = runCommand(cmd);
    if (answer === 'limpar') setLog([]);
    else setLog((l) => [...l.slice(-12), { cmd: cmd.trim(), answer }]);
    setValue('');
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    ask(value);
  }

  return (
    <div className="term" role="region" aria-labelledby="term-title">
      <div className="term__bar">
        <span className="term__dots" aria-hidden="true"><i /><i /><i /></span>
        <span id="term-title" className="term__title">claude-code — pergunte sobre o Bruno</span>
      </div>
      {/* Leitores de tela recebem o texto completo de uma vez; a animação é só visual. */}
      <p className="sr-only">
        Pedido do Bruno à IA: {PROMPT} Resposta: {STEPS.join('; ')}.
      </p>
      <div className="term__body" ref={bodyRef}>
        <div aria-hidden="true">
          <p className="term__who term__who--me">bruno ›</p>
          <p className="term__prompt">
            {PROMPT.slice(0, typed)}
            {typed < PROMPT.length && <span className="term__caret" />}
          </p>
          {typed >= PROMPT.length && <p className="term__who term__who--ai">claude ›</p>}
          <ul className="term__steps">
            {STEPS.map((s, i) => (
              <li key={s} className={i < stage ? 'is-done' : i === stage && typed >= PROMPT.length ? 'is-doing' : 'is-hidden'}>
                <span className="term__mark">{i < stage ? '✓' : '…'}</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <ul className="term__log" aria-live="polite">
          {log.map((l, i) => (
            <li key={i}>
              <span className="term__cmd">você › {l.cmd}</span>
              <p className="term__out">
                {l.answer.text}
                {l.answer.links?.map((k) => (
                  <span key={k.to}>
                    {' '}
                    {k.external ? (
                      <a href={k.to} target="_blank" rel="noopener noreferrer">{k.label}<span className="sr-only"> (abre em nova aba)</span></a>
                    ) : (
                      <Link to={k.to}>{k.label}</Link>
                    )}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="term__foot" ref={footRef} tabIndex={-1}>
        {!done ? (
          <button
            type="button"
            className="term__skip"
            onClick={() => {
              skipFocused.current = true;
              onSkip();
            }}
          >
            Pular animação
          </button>
        ) : (
          <form className="term__form" onSubmit={submit}>
            <label htmlFor="term-input">você ›</label>
            <input
              id="term-input"
              autoComplete="off"
              spellCheck={false}
              placeholder="pergunte algo: sobre, projetos, contato…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-describedby="term-dica"
            />
            <span id="term-dica" className="sr-only">Digite um comando e aperte Enter. Digite ajuda para ver todos.</span>
          </form>
        )}
      </div>
      {done && (
        <div className="term__chips" aria-label="Sugestões de comandos" role="group">
          {SUGGESTED.map((c) => (
            <button key={c} type="button" onClick={() => ask(c)}>{c}</button>
          ))}
        </div>
      )}
    </div>
  );
}
