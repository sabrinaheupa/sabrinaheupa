# Runbook — Substituir Pipeboard pelos MCPs gratuitos de Ads

> Gerado por @devops (Gage) em 2026-06-12. Objetivo: eliminar o custo do Pipeboard.

## O que já foi feito (automático)

Os dois MCPs do Pipeboard foram **removidos** da config do Claude Code (`~/.claude.json`),
em ambos os locais onde estavam configurados:

- `meta-ads`  → `https://meta-ads.mcp.pipeboard.co/?token=pk_...`  ❌ removido
- `google-ads` → `https://google-ads.mcp.pipeboard.co/?token=pk_...` ❌ removido

Backup da config anterior: `~/.claude.json.bak-pipeboard-20260612-180552`
(restaurar com: `cp ~/.claude.json.bak-pipeboard-20260612-180552 ~/.claude.json`)

> **Ação recomendada agora:** cancele/feche a conta no pipeboard.co e revogue o token
> `pk_602521ebb8664563bbb620e1100d9b7f` no painel deles para parar a cobrança de vez.

Os MCPs que continuam funcionando (não mexi): Canva, Google Drive, Gmail.

---

## Google Ads — MCP OFICIAL e GRATUITO ✅ (verificado)

Repositório oficial do Google: **https://github.com/googleads/google-ads-mcp**
Roda localmente via `pipx`, sem custo de terceiros.

### Pré-requisitos (feitos uma vez)
1. **Developer Token do Google Ads** (nível Explorer ou superior, para contas de produção):
   https://developers.google.com/google-ads/api/docs/get-started/dev-token
2. **Projeto no Google Cloud** com a *Google Ads API* habilitada:
   https://console.cloud.google.com/apis/library/googleads.googleapis.com
3. **Credenciais ADC (OAuth)** com escopo `https://www.googleapis.com/auth/adwords`:
   ```bash
   gcloud auth application-default login \
     --scopes https://www.googleapis.com/auth/adwords,https://www.googleapis.com/auth/cloud-platform \
     --client-id-file=SEU_CLIENT_JSON
   ```
   Anote o caminho do arquivo `PATH_TO_CREDENTIALS_JSON` que ele imprime no final.
4. Instalar pipx: https://pipx.pypa.io/stable/#install-pipx

### Adicionar ao Claude Code
```bash
claude mcp add google-ads --scope user -- \
  pipx run --spec git+https://github.com/googleads/google-ads-mcp.git google-ads-mcp
```
Depois edite `~/.claude.json` no servidor `google-ads` e adicione o bloco `env`:
```json
"env": {
  "GOOGLE_APPLICATION_CREDENTIALS": "PATH_TO_CREDENTIALS_JSON",
  "GOOGLE_PROJECT_ID": "SEU_PROJECT_ID",
  "GOOGLE_ADS_DEVELOPER_TOKEN": "SEU_DEVELOPER_TOKEN",
  "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "ID_DA_CONTA_GERENCIADORA_se_houver"
}
```
(O `GOOGLE_ADS_LOGIN_CUSTOMER_ID` só é necessário se você acessa a conta via uma
conta gerenciadora/MCC.)

Validar: `claude mcp list` deve mostrar `google-ads` conectado.

---

## Meta Ads (Facebook/Instagram) — opções gratuitas ⚠️

**Não consegui confirmar nesta sessão um endpoint/repositório OFICIAL da Meta** para o
MCP de Marketing API (os endereços candidatos do "open beta abr/2026" retornaram 404).
**Antes de configurar, confirme o link oficial atual** na doc da Meta:
https://developers.facebook.com/docs/marketing-api/  (procure por "MCP").

Enquanto isso, há um caminho gratuito que **não usa o serviço pago do Pipeboard**:
rodar o pacote open-source `meta-ads-mcp` localmente com **seu próprio App da Meta**.

### Caminho gratuito (self-host, sem Pipeboard)
1. Crie um **App no Meta for Developers** (https://developers.facebook.com/apps) com acesso
   à *Marketing API*. Anote `App ID` e `App Secret`.
2. Gere um **access token** com permissões `ads_read` (e `ads_management` se for editar campanhas).
3. Adicione ao Claude Code:
   ```bash
   claude mcp add meta-ads --scope user -- pipx run meta-ads-mcp
   ```
   e no `env` use seu token direto (sem token do Pipeboard):
   ```json
   "env": {
     "META_APP_ID": "SEU_APP_ID",
     "META_APP_SECRET": "SEU_APP_SECRET",
     "META_ACCESS_TOKEN": "SEU_ACCESS_TOKEN"
   }
   ```
   > Observação: o pacote `meta-ads-mcp` no PyPI é mantido pela própria Pipeboard
   > (github.com/pipeboard-co/meta-ads-mcp), mas suporta autenticação direta com seu
   > token da Meta — ou seja, dá pra usar **sem pagar** o serviço hospedado deles.
   > Variáveis exatas: confirme em https://github.com/pipeboard-co/meta-ads-mcp (seção
   > "Local Installation").

### Quando a Meta confirmar o MCP oficial hospedado
Se/quando a doc oficial publicar o endpoint remoto (geralmente OAuth, estilo conector),
o comando será no formato:
```bash
claude mcp add --transport http meta-ads https://ENDPOINT-OFICIAL-DA-META/mcp
```
e a autenticação será feita via fluxo OAuth no navegador (login na sua conta Meta) —
nenhum token pago necessário.

---

## Checklist de OAuth / ação manual da Sabrina

- [ ] Cancelar conta e revogar token no pipeboard.co (parar cobrança)
- [ ] Google: criar/usar projeto GCP + habilitar Google Ads API
- [ ] Google: obter Developer Token (acesso Explorer+)
- [ ] Google: rodar `gcloud auth application-default login` (OAuth — abre navegador)
- [ ] Google: rodar o `claude mcp add` + preencher env
- [ ] Meta: confirmar link oficial do MCP na doc da Meta (ou usar self-host)
- [ ] Meta: criar App + gerar access token (`ads_read`/`ads_management`)
- [ ] Meta: rodar o `claude mcp add` + preencher env
- [ ] Validar tudo com `claude mcp list`
