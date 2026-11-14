# ghl-calendar-surreal

Stylesheet navy-glass (Surreal Group) para a agenda GHL/LeadConnector do Commercial Group CRM.
Arquivo público e sem segredos · só CSS de aparência.

## Como é usado
No campo "Insira código personalizado" do calendário (GHL):

```html
<style>@import url("https://cdn.jsdelivr.net/gh/surrealgroup/ghl-calendar-surreal@main/ghl-calendar-surreal.css?v=N");</style>
```

## Deploy · 100% porta 443 (não depende de FTP/cPanel)
1. Editar `ghl-calendar-surreal.css`.
2. `git commit -am "..." && git push`.
3. Furar o cache do CDN:
   `curl -s "https://purge.jsdelivr.net/gh/surrealgroup/ghl-calendar-surreal@main/ghl-calendar-surreal.css"`.
4. (opcional) bump `?v=N` no campo do GHL para furar o cache do navegador.
