import { Link } from 'react-router-dom';
import { profile } from '../lib/profile';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <p className="footer__name">{profile.name}</p>
          <p className="footer__small">
            Site feito por mim com o Claude Code como copiloto. Sem rastreadores de terceiros; só cookies essenciais.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="footer__links">
            <li><a href={`mailto:${profile.email}`}>E-mail</a></li>
            <li><a href={profile.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn<span className="sr-only"> (abre em nova aba)</span></a></li>
            <li><a href={profile.github} rel="noopener noreferrer" target="_blank">GitHub<span className="sr-only"> (abre em nova aba)</span></a></li>
          </ul>
          <ul className="footer__links">
            <li><Link to="/privacidade">Privacidade</Link></li>
            <li><Link to="/termos">Termos</Link></li>
            <li><Link to="/cookies">Cookies</Link></li>
            <li><Link to="/seus-dados">Seus dados (LGPD)</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
