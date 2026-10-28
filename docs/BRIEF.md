# Brief — Currículo/portfólio do Bruno Pereira Bento

Documento-mestre do projeto. Quem for trabalhar aqui (pessoa ou IA) começa por este arquivo.

## Objetivo

Um site-currículo "extraordinário" que vai levar a cara do Bruno. Ele precisa passar **confiança e transparência**
e mostrar que o Bruno **sabe o que está fazendo**. Páginas fortes e claras sobre ele. O Bruno se apresenta abertamente
como **vibe coder**: programa com IA (Claude Code) como copiloto. O site não esconde isso: mostra o método
(ele decide, a IA escreve junto, ele testa, revisa e publica) e prova com sistemas que estão no ar de verdade.

## Quem é o Bruno (fonte: READMEs antigos do GitHub dele)

- Nome: **Bruno Pereira Bento**, 25 anos, Brasil (DDD 19, região de Campinas/SP — confirmar cidade com ele).
- Veio da **área comercial**: experiência em comunicação, negociação e resolução de problemas.
- Migrou para tecnologia; finalizando curso de **Desenvolvimento Back-end**. Busca oportunidade como desenvolvedor.
- Stack que já usou nos projetos: Node.js, TypeScript, Express, SQL puro (PostgreSQL e MySQL), React + Vite, Tailwind,
  socket.io, Prisma (MossPlay), testes com Vitest, deploy no Render, bancos Neon/Aiven, Git/GitHub (branch + PR por parte).
- Contatos públicos: LinkedIn https://www.linkedin.com/in/bruno-pereira-5727ba238/ · GitHub
  https://github.com/bruninguigui298-commits · e-mail bruno12pereira472@gmail.com.
  **Não publicar telefone/WhatsApp sem ele confirmar.**
- Faz parte da **Lions Company** (empresa de sites/sistemas/automação com o colega Kaique).

## Projetos reais (portfólio — tudo verificável)

Construídos pelo Bruno com IA entre out/2026 e hoje, cada um com backend em camadas, testes e deploy:

| Projeto | O que é | No ar |
|---|---|---|
| **Red Autos** | Site de seminovos com painel admin, fotos, LGPD, abertura animada (carro com rodas girando) | https://red-autos.onrender.com |
| **Mensalli** | SaaS de mensalidades: Pix copia e cola gerado localmente, lembretes WhatsApp, assinatura Mercado Pago | https://mensalli.onrender.com |
| **Lions Expedição** | NF-e → romaneio → rota → rastreio; app do motorista (PWA), PostGIS, mapas | https://expedicao-itdc.onrender.com |
| **Lions RH** | RH online: recrutamento, vagas públicas, onboarding, segurança reforçada | https://lions-rh.onrender.com |
| **Lions Leads** | Captação de leads: formulário em conversa, rodízio de vendedores, LGPD com criptografia | https://lions-leads.onrender.com |
| **Site Lions Company** | Site institucional com rede de pontos que forma o leão e se transforma ao rolar | https://lions-aep7.onrender.com |
| **LionDevs** | Sistema interno: cotação → PDF → assinatura eletrônica → pedido → nota | https://liondevs.onrender.com (login) |
| **MossPlay** | Projeto acadêmico: plataforma de jogos com pontos fictícios, poker/truco multiplayer em tempo real | https://mossplay.onrender.com |
| **SaaS Restaurante** | Contribuição no projeto do Kaique: estoque PVPS, pedidos de compra em PDF, delivery, relatórios | (privado) |

Atenção: vários repositórios são privados. Mostrar link do site no ar, prints e o que foi feito — não o código.
Nunca inventar métricas, clientes ou depoimentos. MossPlay usa pontos fictícios: descrever como projeto acadêmico,
sem falar em apostas com dinheiro.

## Análise de mercado (resumo)

- Referências de portfólio fortes: Bruno Simon (site 3D interativo), Brittany Chiang (clareza), Lynn Fisher (muda todo ano),
  Jack Jeznach (animação e cor). O que funciona: rápido, responsivo, projetos reais (não clones de tutorial).
- Recrutadores em 2026 assumem que IA foi usada; valorizam quem **explica as decisões**, mostra histórico de commits,
  sabe verificar o que a IA gera e prova com coisa publicada.
- Lacuna que o site do Bruno ocupa: quase ninguém mostra o **processo com IA de forma honesta e verificável**.

## Conceito proposto

"**Eu dirijo, a IA acelera.**" Diferenciais:

1. **Abertura que se constrói sozinha**: um painel tipo editor/chat onde aparece o pedido do Bruno à IA
   ("monta meu currículo…") e o site se monta na frente do visitante (respeitar `prefers-reduced-motion`, botão pular).
2. **Projetos no ar agora**: o backend consulta o `/health` (ou a página) de cada projeto e mostra status ao vivo
   com tempo de resposta — prova de verdade, não promessa. Cache no servidor para não martelar os sites.
3. **Como eu trabalho com IA** (página própria): o fluxo real (pedido → plano → código em camadas → testes →
   checklist LGPD/acessibilidade → PR → deploy), o que a IA faz e o que é responsabilidade dele.
4. **Páginas de caso** por projeto: problema, decisões, o que deu errado e como resolveu, stack, link.
5. **Linha do tempo**: comercial → curso back-end → primeiros sistemas → Lions Company.
6. **Versão recrutador** `/curriculo`: uma página limpa, imprimível em A4 / salvar PDF.
7. Espaço pronto para **vídeo de apresentação** (60–90 s) e **fotos** — o Bruno vai mandar. Até lá, monograma "BP"
   bem desenhado; nunca gerar foto falsa dele com IA.

Visual sugerido (livre para refinar): base clara editorial (papel #F4F1EA, tinta #14130F) com o painel da abertura escuro;
um destaque quente (laranja; para texto usar tom escuro tipo #B93C0F para contraste AA). Fontes auto-hospedadas
(@fontsource): Instrument Serif (títulos/ênfase) + Geist (texto) + Geist Mono (código). Não usar marca/dourado da Lions
como identidade principal — o site é do Bruno; Lions aparece como empresa onde ele atua.

## Padrão obrigatório (de todos os projetos do Bruno)

- Pastas `backend/`, `frontend/`, `database/` (SQL) e `docs/`.
- Backend: Node + TypeScript + Express + SQL puro (`pg`), zod, testes Vitest com PGlite.
  `src/config`, `database`, `domain`, `repositories`, `services`, `controllers`, `routes`, `middlewares`,
  `app.ts`, `container.ts`, `server.ts`. Script `dev:demo` com PGlite para rodar sem banco.
- Frontend: React + Vite + TS com `src/api`, `components`, `pages`, `hooks`, `lib`.
- Deploy: um serviço no Render (`render.yaml`) em que a API também entrega o build do site.
- Backend deste site: mensagens de contato (com consentimento e limite de envio), status ao vivo dos projetos,
  pedidos LGPD com protocolo, `/admin` simples (cookie httpOnly + cabeçalho anti-CSRF) para o Bruno ler mensagens.
- **Checklist**: privacidade, termos, aviso de cookies (só essenciais), formulário do titular (LGPD art. 18) com protocolo,
  coletar só o necessário, nada de rastreador de terceiros, WCAG AA (alt, contraste ≥ 4,5:1, teclado, foco visível, axe 0),
  sem promessas falsas, `docs/LICENCAS.md`, recomendar revisão jurídica.
- Português do Brasil em tudo. Commits pequenos; uma branch + PR por parte (o Bruno faz merge pelo navegador).

## Atualização (out/2026) — dados enviados pelo Bruno (currículo em PDF + certificado)

- Cidade: **Sumaré/SP**.
- Formação: **Desenvolvedor Back-end — SENAI "Dr. Celso Charuri", Sumaré/SP**, 160 h, 20/05/2026 a 07/10/2026, **concluído**.
  Ensino Médio completo. Curso de inglês pausado (não se adaptou ao EAD): inglês básico, em desenvolvimento.
- Experiência: **Luitex Máquinas e Ferramentas** — Jovem Aprendiz (2019), Auxiliar de Logística (2019–2025), Vendedor (2025–atual).
- Não publicar o PDF do certificado (tem o RG).

## Pendências com o Bruno

- Fotos dele (rosto/ambiente de trabalho) e, se quiser, vídeo/áudio de apresentação.
- ~~Telefone~~ → autorizado: (19) 98170-4814 publicado.
- ~~GitHub~~ → principal: github.com/bruninguigui298-commits.
- ~~Certificado~~ → link de verificação do SENAI autorizado e publicado.
- "O que deu errado e como resolvi" de cada projeto, com as palavras dele; prints dos sistemas.
- Domínio: **brunosyster.com** (Hostinger) → passo a passo em docs/DOMINIO.md. Falta o deploy no Render.
