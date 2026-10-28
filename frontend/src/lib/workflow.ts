export const workflow = [
  { step: 'Pedido', who: 'Eu', text: 'Escrevo o que o sistema precisa fazer, para quem, e o que não pode acontecer. Contexto é metade do resultado.' },
  { step: 'Plano', who: 'IA propõe, eu decido', text: 'A IA sugere estrutura, tabelas e rotas. Eu corto o que é excesso, ajusto o que não serve e aprovo.' },
  { step: 'Código em camadas', who: 'IA escreve junto', text: 'Rotas → controllers → services → repositórios, SQL puro e validação com zod. Sempre o mesmo padrão, para eu saber onde cada coisa está.' },
  { step: 'Testes', who: 'Eu exijo, a IA ajuda', text: 'Vitest com PGlite: o SQL roda num Postgres de verdade em memória. Teste vermelho não sobe.' },
  { step: 'Checklist', who: 'Eu', text: 'LGPD (consentimento, coletar só o necessário, pedido do titular), acessibilidade (teclado, contraste, foco visível) e segurança.' },
  { step: 'PR + deploy', who: 'Eu', text: 'Uma branch e um pull request por parte. Leio o diff, faço o merge e publico no Render.' },
];

export const responsibilities = {
  ia: [
    'Escrever o primeiro rascunho do código e dos testes',
    'Sugerir estrutura, nomes e casos que eu não tinha pensado',
    'Explicar erro e trecho de código que eu não conheço',
    'Acelerar o que é repetitivo',
  ],
  eu: [
    'Decidir o que construir e o que fica de fora',
    'Ler e revisar cada mudança antes do merge',
    'Rodar os testes e testar na mão',
    'Responder pelo que está no ar: segurança, LGPD e o cliente',
  ],
};
