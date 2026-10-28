import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { profile } from '../lib/profile';

export const POLICY_UPDATED = 'outubro de 2026';

export function Privacidade() {
  useDocumentTitle('Política de Privacidade');
  return (
    <article className="wrap page legal">
      <p className="eyebrow">Atualizada em {POLICY_UPDATED}</p>
      <h1 className="display">Política de Privacidade</h1>
      <p className="lead">Versão curta: só coleto o que você me manda pelo formulário, uso só para responder e não vendo, não rastreio e não compartilho para marketing.</p>

      <h2 className="h2">Quem é o controlador</h2>
      <p>{profile.name}, pessoa física, dono deste site. Contato para assuntos de dados: <a href={`mailto:${profile.email}`}>{profile.email}</a> ou a página <Link to="/seus-dados">Seus dados (LGPD)</Link>.</p>

      <h2 className="h2">Quais dados e para quê</h2>
      <ul className="bullets">
        <li><strong>Formulário de contato:</strong> nome, e-mail, empresa (opcional) e mensagem. Finalidade: responder você. Base legal: consentimento (LGPD, art. 7º, I), registrado com data e versão do texto.</li>
        <li><strong>Pedidos de titular:</strong> nome, e-mail, tipo do pedido e detalhes. Finalidade: atender seu pedido e comprovar o atendimento. Base legal: cumprimento de obrigação legal (art. 7º, II).</li>
        <li><strong>Endereço IP:</strong> usado só na memória do servidor, por até 1 hora, para limitar envios em excesso (proteção contra abuso). Não é gravado no banco.</li>
        <li><strong>Registros técnicos da hospedagem:</strong> o provedor (Render) mantém registros de acesso (como IP e horário) para segurança e operação do serviço, conforme a política dele.</li>
      </ul>

      <h2 className="h2">O que eu não faço</h2>
      <ul className="bullets">
        <li>Não uso Google Analytics, pixels de redes sociais nem qualquer rastreador de terceiros.</li>
        <li>Não vendo nem compartilho seus dados para marketing.</li>
        <li>Não tomo decisões automatizadas sobre você.</li>
      </ul>

      <h2 className="h2">Por quanto tempo</h2>
      <ul className="bullets">
        <li>Mensagens de contato: até 12 meses, apagadas automaticamente depois disso — ou antes, se você pedir.</li>
        <li>Pedidos de titular: pelo tempo necessário para comprovar que o pedido foi atendido.</li>
      </ul>

      <h2 className="h2">Com quem os dados ficam</h2>
      <p>Com operadores que fazem o site funcionar: a hospedagem (Render) e o provedor do banco de dados PostgreSQL. Esses serviços podem guardar dados em servidores fora do Brasil; a transferência acontece para a execução do serviço e com provedores que adotam medidas de segurança (LGPD, art. 33).</p>

      <h2 className="h2">Segurança</h2>
      <p>Conexão com HTTPS, acesso à área administrativa protegido por senha, cookie de sessão seguro e proteção contra envios automáticos. Nenhum sistema é 100% invulnerável; se algo acontecer, comunico os afetados e a ANPD conforme a lei.</p>

      <h2 className="h2">Seus direitos</h2>
      <p>Você pode pedir confirmação, acesso, correção, anonimização, bloqueio, eliminação, portabilidade, informação sobre compartilhamento e revogação do consentimento (LGPD, art. 18). Use a página <Link to="/seus-dados">Seus dados</Link> — você recebe um protocolo — ou escreva para o e-mail acima. Você também pode reclamar à ANPD.</p>

      <h2 className="h2">Mudanças</h2>
      <p>Se esta política mudar, a data no topo muda junto. Mudanças importantes geram uma nova versão do texto de consentimento.</p>
    </article>
  );
}
