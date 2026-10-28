import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { readStore, writeStore } from '../lib/storage';

export const PROMPT =
  'monta meu currículo: claro, honesto, mostrando que eu programo com IA e provando com os sistemas que estão no ar.';

export const STEPS = [
  'plano: Início, Sobre, Projetos, Como trabalho, Contato',
  'título e apresentação',
  'backend em camadas + testes (Vitest/PGlite)',
  'status ao vivo dos projetos',
  'pronto — revisado e publicado pelo Bruno',
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
  const skipFocused = useRef(false);
  // O botão some ao pular: o foco vai para a mensagem final em vez de se perder.
  useEffect(() => {
    if (done && skipFocused.current) footRef.current?.focus();
  }, [done]);
  return (
    <div className="term" aria-labelledby="term-title">
      <div className="term__bar">
        <span className="term__dots" aria-hidden="true"><i /><i /><i /></span>
        <span id="term-title" className="term__title">claude-code — curriculo-bruno</span>
      </div>
      {/* Leitores de tela recebem o texto completo de uma vez; a animação é só visual. */}
      <p className="sr-only">
        Pedido do Bruno à IA: {PROMPT} Resposta: {STEPS.join('; ')}.
      </p>
      <div className="term__body" aria-hidden="true">
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
          <span className="term__done">Montado com IA. Decidido, revisado e testado por mim.</span>
        )}
      </div>
    </div>
  );
}
