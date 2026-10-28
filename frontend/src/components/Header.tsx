import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { profile } from '../lib/profile';
import { Monogram } from './Monogram';

const NAV = [
  { to: '/sobre', label: 'Sobre' },
  { to: '/projetos', label: 'Projetos' },
  { to: '/como-trabalho-com-ia', label: 'Como trabalho com IA' },
  { to: '/linha-do-tempo', label: 'Linha do tempo' },
  { to: '/contato', label: 'Contato' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="brand">
          <Monogram size={40} />
          <span className="brand__name">{profile.name}</span>
          <span className="sr-only"> — início</span>
        </Link>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
        <nav id="menu-principal" aria-label="Principal" className={open ? 'nav is-open' : 'nav'}>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to}>{n.label}</NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/curriculo" className="nav__cta">Currículo (PDF)</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
