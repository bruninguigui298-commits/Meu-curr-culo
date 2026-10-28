import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { POLICY_UPDATED } from './Privacidade';

export function Cookies() {
  useDocumentTitle('Cookies');
  return (
    <article className="wrap page legal">
      <p className="eyebrow">Atualizado em {POLICY_UPDATED}</p>
      <h1 className="display">Cookies e armazenamento</h1>
      <p className="lead">Este site só usa o essencial. Não há cookies de análise, publicidade ou redes sociais — por isso não pedimos consentimento para cookies, só avisamos.</p>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Tabela de cookies e armazenamento">
        <table className="table">
          <caption className="sr-only">O que este site guarda no seu navegador</caption>
          <thead>
            <tr><th scope="col">Nome</th><th scope="col">Tipo</th><th scope="col">Para quê</th><th scope="col">Duração</th></tr>
          </thead>
          <tbody>
            <tr><td><code>bp_admin</code></td><td>Cookie essencial (httpOnly)</td><td>Manter o login da área administrativa. Só existe para o dono do site.</td><td>8 horas</td></tr>
            <tr><td><code>bp-aviso-cookies</code></td><td>localStorage</td><td>Lembrar que você fechou este aviso.</td><td>Até você limpar o navegador</td></tr>
            <tr><td><code>bp-intro-vista</code></td><td>sessionStorage</td><td>Não repetir a animação de abertura na mesma visita.</td><td>Até fechar a aba</td></tr>
          </tbody>
        </table>
      </div>
      <p>Fontes são servidas pelo próprio site (sem Google Fonts), então nenhum serviço externo recebe sua visita por causa delas.</p>
    </article>
  );
}
