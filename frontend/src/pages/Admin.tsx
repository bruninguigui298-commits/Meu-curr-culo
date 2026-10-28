import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api, ApiError, setCsrfToken } from '../api/client';
import type { ContactMessage, LgpdRequest, LgpdStatus } from '../api/types';
import { TextField } from '../components/Field';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDateTime } from '../lib/format';
import { LGPD_STATUS_LABEL, LGPD_TYPES } from '../lib/lgpd';

type Phase = 'checking' | 'login' | 'in';

export function Admin() {
  useDocumentTitle('Admin');
  const [phase, setPhase] = useState<Phase>('checking');

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    api<{ csrfToken: string }>('/admin/sessao')
      .then((s) => {
        setCsrfToken(s.csrfToken);
        setPhase('in');
      })
      .catch(() => setPhase('login'));
    return () => {
      meta.remove();
    };
  }, []);

  return (
    <div className="wrap page admin">
      <p className="eyebrow">Área do Bruno</p>
      <h1 className="display">Admin</h1>
      {phase === 'checking' && <p role="status">Verificando sessão…</p>}
      {phase === 'login' && <Login onDone={() => setPhase('in')} />}
      {phase === 'in' && <Dashboard onLogout={() => setPhase('login')} />}
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const s = await api<{ csrfToken: string }>('/admin/login', { method: 'POST', body: { password } });
      setCsrfToken(s.csrfToken);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao entrar.');
    }
  }
  return (
    <form className="form form--narrow" onSubmit={submit}>
      <TextField id="password" label="Senha" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={error || undefined} />
      <button className="btn btn--solid" type="submit">Entrar</button>
    </form>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [requests, setRequests] = useState<LgpdRequest[] | null>(null);
  const [error, setError] = useState('');

  const handle = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        setCsrfToken(null);
        onLogout();
      } else setError(err instanceof ApiError ? err.message : 'Erro inesperado.');
    },
    [onLogout],
  );

  const load = useCallback(() => {
    api<{ messages: ContactMessage[] }>('/admin/mensagens').then((r) => setMessages(r.messages), handle);
    api<{ requests: LgpdRequest[] }>('/admin/lgpd').then((r) => setRequests(r.requests), handle);
  }, [handle]);
  useEffect(load, [load]);

  async function markRead(id: number) {
    try {
      const { message } = await api<{ message: ContactMessage }>(`/admin/mensagens/${id}/lida`, { method: 'PATCH' });
      setMessages((ms) => ms?.map((m) => (m.id === id ? message : m)) ?? null);
    } catch (e) {
      handle(e);
    }
  }
  async function remove(id: number) {
    if (!window.confirm('Apagar esta mensagem para sempre?')) return;
    try {
      await api(`/admin/mensagens/${id}`, { method: 'DELETE' });
      setMessages((ms) => ms?.filter((m) => m.id !== id) ?? null);
    } catch (e) {
      handle(e);
    }
  }
  async function setStatus(id: number, status: LgpdStatus) {
    try {
      const { request } = await api<{ request: LgpdRequest }>(`/admin/lgpd/${id}`, { method: 'PATCH', body: { status } });
      setRequests((rs) => rs?.map((r) => (r.id === id ? request : r)) ?? null);
    } catch (e) {
      handle(e);
    }
  }
  async function logout() {
    await api('/admin/logout', { method: 'POST' }).catch(() => undefined);
    setCsrfToken(null);
    onLogout();
  }

  return (
    <>
      <p><button type="button" className="btn btn--line" onClick={logout}>Sair</button></p>
      {error && <p className="err" role="alert">{error}</p>}

      <section aria-labelledby="msgs-titulo" className="section">
        <h2 id="msgs-titulo" className="h2">Mensagens {messages && `(${messages.filter((m) => !m.readAt).length} não lidas)`}</h2>
        {!messages ? <p>Carregando…</p> : messages.length === 0 ? <p>Nenhuma mensagem ainda.</p> : (
          <ul className="admin-list">
            {messages.map((m) => (
              <li key={m.id} className={m.readAt ? 'admin-item' : 'admin-item is-new'}>
                <p className="admin-item__meta">
                  <strong>{m.name}</strong> · <a href={`mailto:${m.email}`}>{m.email}</a>
                  {m.company && <> · {m.company}</>} · {formatDateTime(m.createdAt)}
                  {!m.readAt && <span className="pill">nova</span>}
                </p>
                <p className="admin-item__body">{m.message}</p>
                <p className="admin-item__small">Consentimento v{m.consentVersion} em {formatDateTime(m.consentAt)}</p>
                <div className="admin-item__actions">
                  {!m.readAt && <button type="button" className="btn btn--line btn--sm" onClick={() => markRead(m.id)}>Marcar como lida</button>}
                  <button type="button" className="btn btn--line btn--sm" onClick={() => remove(m.id)}>Apagar<span className="sr-only"> mensagem de {m.name}</span></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="lgpd-titulo" className="section">
        <h2 id="lgpd-titulo" className="h2">Pedidos LGPD</h2>
        {!requests ? <p>Carregando…</p> : requests.length === 0 ? <p>Nenhum pedido.</p> : (
          <ul className="admin-list">
            {requests.map((r) => (
              <li key={r.id} className="admin-item">
                <p className="admin-item__meta">
                  <strong className="protocol">{r.protocol}</strong> · {r.name} · <a href={`mailto:${r.email}`}>{r.email}</a> · {formatDateTime(r.createdAt)}
                </p>
                <p className="admin-item__body"><strong>{LGPD_TYPES[r.requestType] ?? r.requestType}</strong>{r.details && <> — {r.details}</>}</p>
                <div className="field field--inline">
                  <label htmlFor={`st-${r.id}`}>Situação</label>
                  <select id={`st-${r.id}`} value={r.status} onChange={(e) => setStatus(r.id, e.target.value as LgpdStatus)}>
                    {Object.entries(LGPD_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
