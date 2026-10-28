import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFound() {
  useDocumentTitle('Página não encontrada');
  return (
    <div className="wrap page">
      <p className="eyebrow">Erro 404</p>
      <h1 className="display">Essa página não existe.</h1>
      <p className="lead">O link pode estar errado ou a página mudou de lugar.</p>
      <p><Link className="btn btn--solid" to="/">Voltar ao início</Link></p>
    </div>
  );
}
