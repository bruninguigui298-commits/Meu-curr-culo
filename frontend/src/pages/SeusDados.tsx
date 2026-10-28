import { useRef, useState, type FormEvent } from 'react';
import { api, ApiError } from '../api/client';
import { Honeypot, TextArea, TextField } from '../components/Field';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDateTime } from '../lib/format';
import { LGPD_STATUS_LABEL, LGPD_TYPES } from '../lib/lgpd';

export function SeusDados() {
  useDocumentTitle('Seus dados (LGPD)');
  return (
    <div className="wrap page legal">
      <p className="eyebrow">LGPD · art. 18</p>
      <h1 className="display">Seus dados, seus direitos.</h1>
      <p className="lead">
        Você pode pedir para confirmar, acessar, corrigir, apagar ou levar seus dados, e revogar consentimento. Cada
        pedido recebe um <strong>protocolo</strong> para você acompanhar. Respondo em até 15 dias.
      </p>
      <div className="two-forms">
        <RequestForm />
        <LookupForm />
      </div>
    </div>
  );
}

function RequestForm() {
  const [form, setForm] = useState({ name: '', email: '', requestType: '', details: '' });
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [protocol, setProtocol] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setError('');
    try {
      const res = await api<{ protocol: string | null }>('/lgpd/pedidos', {
        method: 'POST',
        body: { ...form, details: form.details || undefined, website },
      });
      setProtocol(res.protocol ?? 'recebido');
      setForm({ name: '', email: '', requestType: '', details: '' });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields);
        setError(err.message);
      } else setError('Algo deu errado. Tente de novo.');
    } finally {
      setSending(false);
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }

  return (
    <form className="form" onSubmit={submit} noValidate aria-labelledby="pedido-titulo">
      <h2 id="pedido-titulo" className="h2">Fazer um pedido</h2>
      <TextField id="lgpd-name" label="Nome" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
      <TextField id="lgpd-email" label="E-mail" type="email" required autoComplete="email" hint="Use o mesmo e-mail que você usou no contato, se for o caso." value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
      <div className="field">
        <label htmlFor="lgpd-type">Tipo de pedido<span aria-hidden="true"> *</span></label>
        <select
          id="lgpd-type"
          required
          value={form.requestType}
          onChange={(e) => setForm({ ...form, requestType: e.target.value })}
          aria-invalid={errors.requestType ? true : undefined}
          aria-describedby={errors.requestType ? 'lgpd-type-erro' : undefined}
        >
          <option value="">Escolha…</option>
          {Object.entries(LGPD_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        {errors.requestType && <p id="lgpd-type-erro" className="field__error">{errors.requestType}</p>}
      </div>
      <TextArea id="lgpd-details" label="Detalhes (opcional)" rows={4} maxLength={4000} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} error={errors.details} />
      <Honeypot value={website} onChange={setWebsite} />
      <button className="btn btn--solid" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar pedido'}</button>
      <div ref={resultRef} tabIndex={-1} role="status" className="form__result">
        {protocol && (
          <p className="ok">
            Pedido registrado. Seu protocolo: <strong className="protocol">{protocol}</strong>. Guarde este número.
          </p>
        )}
        {error && <p className="err">{error}</p>}
      </div>
    </form>
  );
}

function LookupForm() {
  const [protocol, setProtocol] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<{ status: keyof typeof LGPD_STATUS_LABEL; createdAt: string; updatedAt: string } | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const resultRef = useRef<HTMLDivElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setResult(null);
    setError('');
    setErrors({});
    try {
      setResult(await api('/lgpd/consulta', { method: 'POST', body: { protocol, email } }));
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields);
        setError(err.message);
      } else setError('Algo deu errado.');
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  return (
    <form className="form" onSubmit={submit} noValidate aria-labelledby="consulta-titulo">
      <h2 id="consulta-titulo" className="h2">Acompanhar pelo protocolo</h2>
      <TextField id="q-protocol" label="Protocolo" required placeholder="LGPD-2026-XXXXXXXX" value={protocol} onChange={(e) => setProtocol(e.target.value)} error={errors.protocol} />
      <TextField id="q-email" label="E-mail do pedido" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <button className="btn btn--line" type="submit">Consultar</button>
      <div ref={resultRef} tabIndex={-1} role="status" className="form__result">
        {result && (
          <p className="ok">
            Situação: <strong>{LGPD_STATUS_LABEL[result.status]}</strong>. Aberto em {formatDateTime(result.createdAt)},
            última atualização em {formatDateTime(result.updatedAt)}.
          </p>
        )}
        {error && <p className="err">{error}</p>}
      </div>
    </form>
  );
}
