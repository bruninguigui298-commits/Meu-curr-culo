# Domínio da Hostinger no Render

O domínio continua registrado na Hostinger. Lá você só muda os **registros DNS** para apontarem para o serviço no Render.
Domínio do Bruno: **brunosyster.com** (registrado na Hostinger).

## 1. Publicar o site no Render (se ainda não publicou)

1. Render → **New → Blueprint** → escolha o repositório `Meu-curr-culo` (ele lê o `render.yaml`).
2. Preencha `DATABASE_URL` (ex.: Neon) e `ADMIN_PASSWORD` (12+ caracteres).
3. Espere o deploy ficar verde e abra `https://bruno-curriculo.onrender.com` para conferir.
   (O nome final aparece no painel do serviço; use ele no passo 3.)

## 2. Adicionar o domínio no Render

Serviço `bruno-curriculo` → **Settings → Custom Domains → Add Custom Domain**:

- adicione `brunosyster.com` (o Render adiciona o `www` como redirecionamento, ou o contrário).

O Render mostra os registros que espera. Confira se batem com os do passo 3.

## 3. Mudar o DNS na Hostinger

hPanel → **Domínios** → seu domínio → **DNS / Nameservers** → **Registros DNS**.

Apague os registros antigos que apontam para a hospedagem/estacionamento da Hostinger e deixe assim:

| Tipo | Nome | Aponta para | TTL |
|---|---|---|---|
| A | `@` | `216.24.57.1` | o menor possível (ex.: 300) |
| CNAME | `www` | `bruno-curriculo.onrender.com` | o menor possível |

Importante:

- **Apague qualquer registro AAAA** (IPv6) de `@` e de `www`: o Render usa IPv4 e o AAAA atrapalha a verificação.
- Só pode existir **um** registro A para `@`. Se tiver outro (o IP da Hostinger), apague.
- Não mexa nos registros MX/TXT se você usa e-mail no domínio.
- Os nameservers precisam ser os da Hostinger (padrão). Se o domínio usa Cloudflare, o DNS se configura lá.

## 4. Verificar

De volta ao Render, clique em **Verify** em cada domínio. A propagação pode levar de minutos a algumas horas.
Quando verificar, o Render emite o certificado HTTPS sozinho (Let's Encrypt).

## Não precisa mudar o código

O site não depende do endereço: funciona em `*.onrender.com` e no seu domínio ao mesmo tempo. O cookie do `/admin`
vale para o domínio que você estiver usando.

Fontes: [Render — Configuring DNS Providers](https://render.com/docs/configure-other-dns) ·
[Render — exemplo com Namecheap](https://render.com/docs/configure-namecheap-dns)
