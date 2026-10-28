# Bruno Pereira Bento — currículo/portfólio

Site-currículo do Bruno: **"Eu dirijo, a IA acelera."** Mostra abertamente que ele programa com IA (Claude Code) e prova
com sistemas que estão no ar — com status consultado ao vivo pelo servidor.

- Fonte da verdade do projeto: [docs/BRIEF.md](docs/BRIEF.md)
- Layout no Figma: [docs/FIGMA.md](docs/FIGMA.md)
- Licenças: [docs/LICENCAS.md](docs/LICENCAS.md)
- Domínio da Hostinger no Render: [docs/DOMINIO.md](docs/DOMINIO.md)

## Estrutura

```
backend/    Node + TypeScript + Express + SQL puro (pg) + zod · testes Vitest com PGlite
  src/config  database  domain  repositories  services  controllers  routes  middlewares
      app.ts  container.ts  server.ts
frontend/   React + Vite + TypeScript
  src/api  components  pages  hooks  lib  styles
database/   SQL (migrações aplicadas na subida do servidor)
docs/       brief, Figma, licenças
render.yaml um serviço no Render: a API entrega o build do site
```

## Rodar sem banco (modo demo)

Precisa de Node 20+.

```bash
npm run install:all
```

```bash
npm run demo
```

Abre em http://localhost:3000. O banco é um Postgres em memória (PGlite): nada é salvo ao reiniciar.
O `/admin` usa a senha `demo-admin-senha` (aparece no terminal).

Para desenvolver o visual com recarga automática, rode em dois terminais:

```bash
npm run dev:demo --prefix backend
```

```bash
npm run dev --prefix frontend
```

e abra http://localhost:5173 (o Vite repassa `/api` para a porta 3000).

## Rodar com Postgres de verdade

Copie `backend/.env.example` para `backend/.env`, preencha `DATABASE_URL`, `ADMIN_PASSWORD` e `SESSION_SECRET`, e rode:

```bash
npm run build && npm start
```

As tabelas são criadas sozinhas a partir de `database/*.sql`.

## Testes e verificações

```bash
npm test
```

```bash
npm run typecheck
```

Acessibilidade (axe, WCAG 2.1 AA) nas páginas principais, com o site rodando em `localhost:3000`:

```bash
npm run a11y --prefix frontend
```

## API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/health` | Saúde do serviço |
| GET | `/api/projetos/status` | Status ao vivo dos projetos (timeout 8 s, cache 5 min) |
| POST | `/api/contato` | Mensagem de contato (exige consentimento; 3 por hora por IP) |
| POST | `/api/lgpd/pedidos` | Pedido do titular (LGPD art. 18) → devolve protocolo |
| POST | `/api/lgpd/consulta` | Consulta por protocolo + e-mail |
| POST | `/api/admin/login` | Login (cookie httpOnly + token anti-CSRF no corpo) |
| GET | `/api/admin/sessao` | Recupera o token anti-CSRF pelo cookie |
| GET/PATCH/DELETE | `/api/admin/mensagens…` | Ler, marcar como lida, apagar |
| GET/PATCH | `/api/admin/lgpd…` | Ver pedidos e mudar situação |

Todas as rotas do admin (menos login e sessão) exigem o cookie **e** o cabeçalho `x-csrf-token`.

## Deploy no Render

1. No Render: **New → Blueprint** e escolha este repositório (ele lê o `render.yaml`).
2. Preencha `DATABASE_URL` (ex.: Neon) e `ADMIN_PASSWORD` (12+ caracteres). O `SESSION_SECRET` é gerado sozinho.
3. Pronto: o mesmo serviço entrega a API e o site.

## Como atualizar conteúdo

- Textos dos projetos e páginas de caso: `frontend/src/lib/projects.ts` (campo `lessons` = "o que deu errado").
- Dados pessoais, foto e vídeo: `frontend/src/lib/profile.ts` (arquivos em `frontend/public/`).
- Linha do tempo: `frontend/src/lib/timeline.ts`.
- Projetos monitorados pelo status: `backend/src/domain/projects.ts` (slugs iguais aos do frontend — há teste conferindo).
