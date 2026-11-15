# Deploy · calls.commercialgroup.com.br (agenda do Rodolfo Fernandes)

Página wrapper (iframe full-screen navy-glass) idêntica em estrutura à
`calls.surrealgroup.com.br`, com nome/descrição/foto do Rodolfo Fernandes
(Diretor e Consultor Especialista · Commercial Group).

Arquivos desta pasta → vão para o **docroot do subdomínio** `calls.commercialgroup.com.br`:
- `index.html`
- `rodolfo-fernandes.jpg`

---

## 0) PENDENTE — ID da agenda do Rodolfo no GHL

No `index.html`, trocar o placeholder no `src` do iframe:

```
.../widget/booking/COLE_AQUI_O_ID_DA_AGENDA_DO_RODOLFO?...
```

pelo ID do calendário **do Rodolfo** (o trecho final de `/widget/booking/ID`).
> ⚠️ Hoje o placeholder NÃO é o do Rodolfo. O ID `NryhANunHOaPLF8sjqJB` é do
> José Inácio (a referência). Se publicar com ele, quem agendar cai na agenda do José.

---

## 1) DNS no Cloudflare (zona commercialgroup.com.br)

Adicionar 1 registro (o mais simples e à prova de erro):

| Tipo  | Nome    | Destino                   | Proxy            | TTL  |
|-------|---------|---------------------------|------------------|------|
| CNAME | `calls` | `commercialgroup.com.br`  | Proxied (laranja)| Auto |

> Alternativa: registro `A` com `calls` apontando para o MESMO IP do registro
> `@`/`www` existente, com o mesmo status de proxy.

---

## 2) Subdomínio no cPanel

cPanel → **Domínios / Subdomínios** → criar:
- Subdomínio: `calls`
- Domínio: `commercialgroup.com.br`
- Document Root: `/home/commerci/calls.commercialgroup.com.br` (ou o padrão sugerido)

Depois: cPanel → **SSL/TLS Status** → rodar **AutoSSL** no novo subdomínio
(se o Cloudflare estiver em modo Full/Full-Strict, o origin precisa de certificado).

---

## 3) Subir os arquivos

cPanel → **Gerenciador de Arquivos** → entrar no docroot do subdomínio →
enviar `index.html` e `rodolfo-fernandes.jpg`.

> Ou via o workflow de sempre (git): manter esta pasta no repositório e puxar
> no servidor, como nos outros projetos.

---

## 4) Link de login único (SSO) do cPanel

Rodar **na sua máquina** (tem rede liberada; esta sessão na nuvem não alcança a porta 2087):

```bash
curl -sS "https://commercialgroup.com.br:2087/json-api/create_user_session?api.version=1&user=commerci&service=cpaneld" \
  -H "Authorization: whm SEU_USUARIO_WHM:SEU_TOKEN_WHM"
```

- `SEU_USUARIO_WHM` = `root` (se o token for root/nível total) ou o usuário da revenda.
- `SEU_TOKEN_WHM` = o token de API do WHM.
- A resposta traz `data.url` = **URL de login único** (uso único, expira rápido).

> Fallback (sem WHM): logar normal em `https://commercialgroup.com.br:2083`
> com usuário `commerci` e a senha da conta.

---

## 5) Conferência

- `https://calls.commercialgroup.com.br/` abre a agenda do Rodolfo (dados dele no widget).
- Prévia de link (WhatsApp/LinkedIn) mostra a foto e "Agende com Rodolfo Fernandes · Commercial Group".
