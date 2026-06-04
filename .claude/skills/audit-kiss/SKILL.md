---
name: audit-kiss
description: |
  Sobe o app de Auditoria de Marketing Thiago Kiss na máquina do usuário.
  Prepara o ambiente (npm install se faltar), inicia o app Next.js localmente
  e abre no navegador. Use quando o usuário digitar /audit-kiss ou pedir pra
  "abrir a auditoria", "rodar a auditoria de marketing", "subir o app do Thiago Kiss".
user-invocable: true
version: "1.0.0"
---

# /audit-kiss — Subir o app de Auditoria de Marketing (Thiago Kiss)

## Propósito

Deixar o app de auditoria de marketing rodando na máquina do usuário com um comando só. O app recebe a URL de um site e gera uma **auditoria em 6 dimensões** (5 analistas em paralelo + análise competitiva) com **score global** e **relatório em PDF**. Esta skill cuida de preparar o ambiente, subir o servidor local e abrir o navegador.

## Quando usar

Quando o usuário digita `/audit-kiss`, ou diz "abre a auditoria", "quero auditar um site", "sobe o app do Thiago Kiss", "rodar a auditoria de marketing".

## O que o app precisa (a skill garante o que dá)

- **Node.js ≥ 20** (o usuário geralmente já tem)
- **dependências** (`npm install` na 1ª vez)
- **CLI do `claude` instalado e logado** — o app usa o `claude` da máquina pra rodar a análise (modelo `sonnet`). **Não usa chave de API** (`ANTHROPIC_API_KEY` é ignorada de propósito). Se o `claude` não estiver autenticado, a auditoria falha com erro do CLI. Para checar: `claude --version` e, se preciso, pedir pro usuário rodar o login do Claude Code.

## Passo a passo (executar nesta ordem)

### 1. Localizar a pasta do app

O app fica em `apps/audit-thiagokiss` a partir da raiz do repositório. Confirme que `apps/audit-thiagokiss/package.json` existe. Se não estiver lá (estrutura diferente no repo do aluno), procure com Glob `**/audit-thiagokiss/package.json` e use a pasta encontrada. Trabalhe sempre **dentro** dessa pasta.

### 2. Verificar se o app já está rodando

Antes de qualquer coisa, cheque a porta:

```
curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/audit
```

Se responder `200`, o app **já está no ar** — pule direto para o passo 5 (abrir o navegador) e avise o usuário.

### 3. Instalar dependências (só na 1ª vez)

Se a pasta `node_modules` não existir dentro de `apps/audit-thiagokiss`, rode:

```
npm install
```

(É idempotente — seguro rodar de novo se houver dúvida.)

### 4. Subir o servidor (em background)

Suba o app **em background** (use `run_in_background` do Bash) a partir da pasta do app:

```
npm run dev
```

O servidor sobe na porta **3010**. Depois espere ele responder (faça polling curto em `http://localhost:3010/audit` até retornar `200`, com timeout de ~30s — o primeiro boot do Next.js compila e demora um pouco). Não bloqueie esperando o processo terminar — ele fica rodando.

### 5. Abrir no navegador

O app tem `basePath: "/audit"`, então a URL correta é `http://localhost:3010/audit`:

- **Windows:** `start http://localhost:3010/audit`
- **Mac:** `open http://localhost:3010/audit`
- **Linux:** `xdg-open http://localhost:3010/audit`

### 6. Avisar o usuário

Diga, em pt-BR e de forma curta:

- O app abriu no navegador em `http://localhost:3010/audit`.
- É só colar a URL de um site e clicar em **Auditar agora**. A análise leva 60-90 segundos (5 analistas em paralelo).
- No fim dá pra **baixar o relatório completo em PDF**.
- Para **desligar** o app depois: encerrar o processo do `npm run dev` (ou fechar o terminal/sessão).

## Notas

- O app roda **100% local** (`localhost:3010`), nada é exposto pra internet.
- A análise depende do **CLI do `claude`** estar logado na máquina — não há chave de API pra configurar.
- Se a porta 3010 estiver ocupada, ajuste o script `dev`/`start` no `package.json` do app (flag `-p`) e a URL de acordo.
- Variáveis opcionais: `CLAUDE_BIN` (caminho do binário do claude) e `CLAUDE_MODEL` (default `sonnet`).
