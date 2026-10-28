import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

interface BaseProps {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: string;
}

function describedBy(id: string, error?: string, hint?: string) {
  return [hint ? `${id}-dica` : null, error ? `${id}-erro` : null].filter(Boolean).join(' ') || undefined;
}

export function TextField({ id, label, error, hint, ...rest }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{rest.required && <span aria-hidden="true"> *</span>}</label>
      {hint && <p id={`${id}-dica`} className="field__hint">{hint}</p>}
      <input id={id} name={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} {...rest} />
      {error && <p id={`${id}-erro`} className="field__error">{error}</p>}
    </div>
  );
}

export function TextArea({ id, label, error, hint, ...rest }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{rest.required && <span aria-hidden="true"> *</span>}</label>
      {hint && <p id={`${id}-dica`} className="field__hint">{hint}</p>}
      <textarea id={id} name={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} {...rest} />
      {error && <p id={`${id}-erro`} className="field__error">{error}</p>}
    </div>
  );
}

/** Campo-isca para robôs: fora da tela, fora da ordem de tabulação e escondido de leitores de tela. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor="website">Não preencha este campo</label>
      <input id="website" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
