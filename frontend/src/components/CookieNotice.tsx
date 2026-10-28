import { useState } from 'react';
import { Link } from 'react-router-dom';
import { readStore, writeStore } from '../lib/storage';

const KEY = 'bp-aviso-cookies';

/** Aviso (não é banner de consentimento): o site só usa armazenamento essencial. */
export function CookieNotice() {
  const [hidden, setHidden] = useState(() => readStore('local', KEY) === '1');
  if (hidden) return null;
  return (
    <section className="cookie" aria-label="Aviso de cookies">
      <p>
        Este site não usa cookies de rastreamento nem de publicidade. Só o essencial para funcionar.{' '}
        <Link to="/cookies">Saiba mais</Link>.
      </p>
      <button
        type="button"
        onClick={() => {
          writeStore('local', KEY, '1');
          setHidden(true);
        }}
      >
        Entendi
      </button>
    </section>
  );
}
