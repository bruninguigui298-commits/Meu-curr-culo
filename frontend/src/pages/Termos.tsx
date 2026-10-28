import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { profile } from '../lib/profile';
import { POLICY_UPDATED } from './Privacidade';

export function Termos() {
  useDocumentTitle('Termos de uso');
  return (
    <article className="wrap page legal">
      <p className="eyebrow">Atualizados em {POLICY_UPDATED}</p>
      <h1 className="display">Termos de uso</h1>
      <h2 className="h2">O que é este site</h2>
      <p>Um currículo e portfólio pessoal de {profile.name}. Ele apresenta minha trajetória e projetos que construí ou ajudei a construir.</p>
      <h2 className="h2">Projetos e links externos</h2>
      <p>Os projetos apontam para sistemas hospedados em outros endereços, alguns de terceiros (clientes ou a Lions Company). Cada sistema tem seus próprios termos e política de privacidade. O status "no ar" é uma consulta automática feita pelo servidor deste site e pode não refletir o momento exato em que você acessa.</p>
      <p>O MossPlay é um projeto acadêmico com pontos fictícios, sem apostas ou dinheiro real.</p>
      <h2 className="h2">Conteúdo</h2>
      <p>Textos e layout deste site são meus. Marcas e nomes de projetos de terceiros pertencem aos seus donos. As fontes e bibliotecas usadas estão listadas com suas licenças no repositório (docs/LICENCAS.md).</p>
      <h2 className="h2">Uso do formulário</h2>
      <p>Não envie dados sensíveis (saúde, religião, documentos) pelo formulário. Envios automáticos ou em massa são bloqueados.</p>
      <h2 className="h2">Sem garantias</h2>
      <p>O site é oferecido como está. Faço o possível para manter tudo correto e no ar, mas não garanto disponibilidade contínua.</p>
      <h2 className="h2">Dúvidas</h2>
      <p>Escreva para <a href={`mailto:${profile.email}`}>{profile.email}</a>. Veja também a <Link to="/privacidade">Política de Privacidade</Link>. Estes termos seguem a lei brasileira.</p>
    </article>
  );
}
