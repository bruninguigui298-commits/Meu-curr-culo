import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { timeline } from '../lib/timeline';

export function LinhaDoTempo() {
  useDocumentTitle('Linha do tempo');
  return (
    <div className="wrap page">
      <p className="eyebrow">Linha do tempo</p>
      <h1 className="display">Do comercial ao código.</h1>
      <ol className="tl">
        {timeline.map((t) => (
          <li key={t.title} className="tl__item">
            {t.when && <p className="tl__when">{t.when}</p>}
            <h2 className="tl__t">{t.title}</h2>
            <p>{t.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
