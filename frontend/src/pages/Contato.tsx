import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { Honeypot, TextArea, TextField } from '../components/Field';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { profile } from '../lib/profile';

const empty = { name: '', email: '', company: '', message: '' };

export function Contato() {
  useDocumentTitle('Contato');
  const [form, setForm] = useState(empty);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [globalError, setGlobalError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState('sending');
    setErrors({});
    try {
      await api('/contato', { method: 'POST', body: { ...form, company: form.company || undefined, consent, website } });
      setState('sent');
      setForm(empty);
      setConsent(false);
    } catch (err) {
      setState('error');
      if (err instanceof ApiError) {
        setErrors(err.fields);
        setGlobalError(err.message);
      } else setGlobalError('Algo deu errado. Tente de novo.');
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  return (
    <div className="wrap page">
      <p className="eyebrow">Contato</p>
      <h1 className="display">Próxima parada: a sua equipe.</h1>
      <div className="contact">
        <div>
          <p className="lead">
            Vaga, projeto ou só uma dúvida sobre como eu trabalho com IA — eu respondo pessoalmente.
          </p>
          <ul className="contact__direct">
            <li><span>E-mail</span> <a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            {profile.phone && <li><span>Telefone</span> <a href={`tel:${profile.phone.tel}`}>{profile.phone.display}</a></li>}
            <li><span>LinkedIn</span> <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">bruno-pereira-5727ba238<span className="sr-only"> (abre em nova aba)</span></a></li>
            <li><span>GitHub</span> <a href={profile.github} target="_blank" rel="noopener noreferrer">bruninguigui298-commits<span className="sr-only"> (abre em nova aba)</span></a></li>
          </ul>
        </div>

        <form className="form" onSubmit={submit} noValidate aria-describedby="form-info">
          <p id="form-info" className="field__hint">
            Campos com * são obrigatórios. Uso seus dados só para responder esta mensagem; guardo por até 12 meses.
          </p>
          <TextField id="name" label="Seu nome" required autoComplete="name" maxLength={120} value={form.name} onChange={set('name')} error={errors.name} />
          <TextField id="email" label="Seu e-mail" type="email" required autoComplete="email" maxLength={254} value={form.email} onChange={set('email')} error={errors.email} />
          <TextField id="company" label="Empresa (opcional)" autoComplete="organization" maxLength={120} value={form.company} onChange={set('company')} error={errors.company} />
          <TextArea id="message" label="Mensagem" required rows={6} maxLength={4000} value={form.message} onChange={set('message')} error={errors.message} />
          <Honeypot value={website} onChange={setWebsite} />
          <div className="field field--check">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? 'consent-erro' : undefined}
            />
            <label htmlFor="consent">
              Li a <Link to="/privacidade">Política de Privacidade</Link> e concordo que o Bruno use meus dados para
              responder esta mensagem. *
            </label>
            {errors.consent && <p id="consent-erro" className="field__error">{errors.consent}</p>}
          </div>
          <button className="btn btn--solid" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
          </button>
          <div ref={resultRef} tabIndex={-1} role="status" className="form__result">
            {state === 'sent' && <p className="ok">Mensagem recebida. Obrigado! Respondo no e-mail que você informou.</p>}
            {state === 'error' && <p className="err">{globalError}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
