/** Mesmas chaves de backend/src/domain/lgpd.ts. */
export const LGPD_TYPES: Record<string, string> = {
  confirmacao: 'Confirmar se trato dados meus',
  acesso: 'Acessar meus dados',
  correcao: 'Corrigir dados incompletos ou errados',
  anonimizacao_bloqueio_eliminacao: 'Anonimizar, bloquear ou eliminar dados desnecessários',
  portabilidade: 'Portabilidade dos dados',
  eliminacao: 'Eliminar dados tratados com meu consentimento',
  informacao_compartilhamento: 'Saber com quem os dados foram compartilhados',
  revogacao_consentimento: 'Revogar meu consentimento',
  outro: 'Outro pedido',
};

export const LGPD_STATUS_LABEL = {
  recebido: 'recebido',
  em_andamento: 'em andamento',
  concluido: 'concluído',
  recusado: 'recusado (com justificativa por e-mail)',
} as const;
