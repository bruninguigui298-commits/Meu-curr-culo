# Figma

> **Atualização (v2):** o site mudou para o tema escuro "rota" (azul-noite, ciano-aurora, âmbar, só a fonte Geist). O arquivo do Figma abaixo mostra o layout da v1 e serve como histórico; a fonte da verdade do visual agora é `frontend/src/styles/tokens.css`.

Arquivo de layout (plano Starter, 1 página usada): **https://www.figma.com/design/neZ6bsLsv9FaSilRUwOC1i**

O que tem lá (página "Site v1"):

- **Home — desktop 1440**: navegação com monograma "BP", abertura com o painel escuro "editor/chat" (pedido do Bruno → a IA monta o site, com botão "Pular animação"), projetos no ar com status ao vivo, "Como eu trabalho com IA" em 6 passos, linha do tempo e contato.
- **Caso — Mensalli — desktop 1440**: modelo de página de caso (problema, decisões, o que deu errado, ficha lateral com stack/testes/deploy/código/IA, espaço para print, navegação entre casos).
- **ProjetoCard** (componente): nome, status ao vivo, resumo, stack e link.

Tokens usados no layout e no código (`frontend/src/styles/tokens.css`):

| Token | Valor | Uso |
|---|---|---|
| papel | `#F4F1EA` | fundo |
| tinta | `#14130F` | texto e painel |
| destaque (texto) | `#B93C0F` | links e rótulos (contraste AA sobre o papel) |
| laranja | `#E8622C` | detalhes no painel escuro |
| verde status | `#1F7A3E` | "no ar" |

Fontes: Instrument Serif (títulos), Geist (texto), Geist Mono (código/rótulos).

Observação: os tempos de resposta no layout são ilustrativos; no site eles vêm da consulta real feita pelo servidor.
