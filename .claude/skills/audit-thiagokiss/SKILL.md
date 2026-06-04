---
name: audit-thiagokiss
description: |
  Sobe o app de Auditoria de Marketing da Consultoria Thiago Kiss na máquina do usuário.
  Prepara o ambiente (instala dependências se faltarem), cria o .env se não existir,
  inicia o servidor Next.js na porta 3010 e abre no navegador.
user-invocable: true
version: "1.0.0"
---

# /audit-thiagokiss — Subir o app de Auditoria de Marketing

## Propósito

Deixar o app de auditoria de marketing rodando localmente com um comando só. O app analisa qualquer site em 6 dimensões usando IA e gera um relatório PDF executivo. Esta skill cuida de preparar o ambiente, configurar o `.env` se necessário, subir o servidor e abrir o navegador.

## Quando usar

Quando o usuário digitar `/audit-thiagokiss`, ou disser "abre o audit", "quero auditar um site", "sobe o app da Thiago Kiss", "executa o audit-thiagokiss".

## O que o app precisa (a skill garante tudo isto)

- **Node.js ≥ 18**
- **dependências** (`npm install`) — a skill instala se `node_modules` não existir
- **`.env`** com `ANTHROPIC_API_KEY` — a skill cria o arquivo se não existir

## Passo a passo (executar nesta ordem)

### 1. Localizar a pasta do app

O app fica em `apps/audit-thiagokiss` a partir da raiz do repositório. Confirme que `apps/audit-thiagokiss/package.json` existe. Trabalhe sempre **dentro** dessa pasta.

### 2. Verificar se o app já está rodando

```
curl -s http://localhost:3010
```

Se responder com HTML (status 200), o app **já está no ar** — pule direto para o passo 5 (abrir no navegador) e avise o usuário.

### 3. Verificar e criar o .env

Verifique se `apps/audit-thiagokiss/.env` existe e contém `ANTHROPIC_API_KEY`.

**Se o `.env` não existir ou estiver sem a chave:**
- Verifique se `ANTHROPIC_API_KEY` está disponível como variável de ambiente no sistema (`echo $ANTHROPIC_API_KEY`)
- Se estiver disponível no ambiente, crie o `.env` automaticamente com esse valor
- Se **não** estiver disponível, informe ao usuário de forma curta:

> Para rodar o app você precisa de uma chave da Anthropic.
> 1. Acesse **console.anthropic.com** → API Keys → Create Key
> 2. Cole aqui: `ANTHROPIC_API_KEY=sk-ant-...`
>
> Quando tiver a chave, responda com ela e eu configuro tudo.

**Nunca bloqueie a execução pedindo a chave antes de verificar o ambiente.**

### 4. Instalar dependências (se necessário)

Se `apps/audit-thiagokiss/node_modules` não existir:

```
npm install
```

Execute dentro da pasta `apps/audit-thiagokiss`.

### 5. Subir o servidor (em background)

Suba o app **em background** (use `run_in_background` do Bash) a partir da pasta do app:

```
npm run dev
```

Aguarde o servidor responder fazendo polling em `http://localhost:3010` (até 30s). Não bloqueie esperando o processo terminar — ele fica rodando.

### 6. Abrir no navegador

- **Mac:** `open http://localhost:3010`
- **Windows:** `start http://localhost:3010`
- **Linux:** `xdg-open http://localhost:3010`

### 7. Avisar o usuário

Diga, em pt-BR e de forma curta:

- O app abriu no navegador em `http://localhost:3010`
- É só colar a URL do site que quer auditar e clicar em **"Auditar agora"**
- A análise leva 60–90 segundos e gera um PDF executivo ao final
- Para **desligar** o app: encerrar o processo do servidor

## Notas

- A skill **nunca pede a chave proativamente** — só verifica se existe e instrui se faltar
- O app roda **100% local** (`localhost:3010`), nada é exposto para a internet
- Se a porta 3010 estiver ocupada, verifique com `lsof -i :3010` e encerre o processo conflitante
