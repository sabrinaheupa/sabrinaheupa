# Task: Ativação de Contexto (anti-dado-morto)

```yaml
task:
  id: activate-context
  name: Tornar o contexto do negócio vivo para sessões futuras
  agent: onboard-chief
  elicit: false
  order: 9
  required: true
```

## Descrição

Fase 7 — **última e obrigatória**. Garante que os documentos preenchidos NÃO fiquem
mortos: gera/atualiza um `CLAUDE.md` na raiz do repo do aliado com uma regra que faz
**toda sessão futura** (inclusive Claude puro, sem nenhuma squad) ler o contexto do
negócio antes de construir qualquer coisa — e nunca perguntar de novo o que já está
salvo. Também cria um `INDEX.md` do negócio como mapa de leitura rápida.

> **Por que isso importa:** o repo do aliado tem AIOX básico, **sem squads**. Não existe
> `workspace-chief` nem `workspace_integration` de outras squads pra carregar contexto.
> O `CLAUDE.md` (carregado automaticamente em toda sessão) é o único mecanismo confiável.

## Pré-requisitos

- Documentos das fases anteriores criados em `workspace/businesses/{slug}/`.

## Workflow

### Passo 1 — Montar o bloco gerenciado do CLAUDE.md

O conteúdo é delimitado por marcadores, para ser **idempotente** (re-rodar substitui só
este bloco, sem tocar no resto do arquivo):

```markdown
<!-- BEGIN onboard-aliado:contexto-do-negocio -->
## Contexto do Negócio (gerado pelo onboard-aliado)

Este repositório tem o contexto do negócio **{business_name}** salvo em
`workspace/businesses/{slug}/`. **REGRA OBRIGATÓRIA para qualquer sessão:**

1. **Antes de construir QUALQUER coisa personalizada** (copy, landing page, anúncio,
   e-mail, post, design, proposta, roteiro, etc.), **leia primeiro** estes arquivos:
   - `workspace/businesses/{slug}/company/company-profile.yaml` — quem é, missão, posicionamento
   - `workspace/businesses/{slug}/company/founder-dna.yaml` — história e voz do fundador
   - `workspace/businesses/{slug}/brand/brand-foundation.yaml` — manifesto, valores, crenças, voz, posicionamento
   - `workspace/businesses/{slug}/company/icp.yaml` — cliente ideal (dor, desejo, objeções)
   - `workspace/businesses/{slug}/products/` — ofertas e produtos
   - `workspace/businesses/{slug}/market/research.yaml` — concorrentes, preços, voz do cliente
   - `workspace/businesses/{slug}/design-system/` — cores, tipografia, identidade visual
2. **NUNCA pergunte ao usuário** algo que já esteja nesses arquivos. Use o que está salvo.
3. Se um campo estiver como `FILL_LATER`, aí sim pergunte — e **salve a resposta** no
   arquivo correspondente, para não perguntar de novo no futuro.
4. Todo material criado deve respeitar o **design system** e a **voz** definidos acima.
5. Mapa rápido dos arquivos: veja `workspace/businesses/{slug}/INDEX.md`.
<!-- END onboard-aliado:contexto-do-negocio -->
```

> Substitua `{business_name}` e `{slug}` pelos valores reais do `state.yaml`.

### Passo 2 — Gravar no `CLAUDE.md` da raiz (criar OU mesclar, sem sobrescrever)

Lógica idempotente (faça você, a IA, via Read + Write):

1. Se `CLAUDE.md` **não existe** na raiz → crie com o bloco do Passo 1.
2. Se **existe** e **não contém** os marcadores → **acrescente** o bloco ao final (preserve todo o conteúdo atual).
3. Se **existe** e **já contém** os marcadores `<!-- BEGIN onboard-aliado:contexto-do-negocio -->`
   ... `<!-- END ... -->` → **substitua apenas o trecho entre os marcadores** pelo bloco novo.

> NUNCA apague conteúdo fora dos marcadores. Em caso de dúvida, mostre o diff ao aliado antes.

Helper portátil (mac + Linux) para checar se o bloco já existe:

```bash
grep -q "onboard-aliado:contexto-do-negocio" CLAUDE.md 2>/dev/null && echo "JA_EXISTE" || echo "AUSENTE"
```

### Passo 3 — Gerar `workspace/businesses/{slug}/INDEX.md`

```markdown
# {business_name} — Índice do Negócio

> Contexto gerado pelo onboard-aliado em {data}. Leia antes de criar qualquer material.

| Arquivo | O que tem |
|---|---|
| `company/company-profile.yaml` | Essência, missão, visão, posicionamento |
| `company/founder-dna.yaml` | História e voz do fundador |
| `brand/brand-foundation.yaml` | Manifesto, missão, visão, valores, crenças, voz, posicionamento |
| `company/icp.yaml` | Cliente ideal (dor, desejo, objeções, red/green flags) |
| `products/` | Ofertas e produtos |
| `market/research.yaml` | Concorrentes, preços, voz do cliente, lacunas |
| `design-system/config.yaml` | Tokens de cor, tipografia, componentes |
| `design-system/tokens.css` | Variáveis CSS prontas |
| `design-system/visual-guidelines.yaml` | Arquétipo, princípio, regras de logo |
| `design-system/brandbook.html` | Página visual do design system (abre no navegador) |

**Completude atual:** company {x}% · icp {x}% · design {x}%
**Pendências (FILL_LATER):** {lista, se houver}
```

### Passo 3c — Inicializar a memória de progresso (`PROGRESS.md`)

O repo do aliado já vem com um `PROGRESS.md` base (arquivos-base do `repo-inicial`).
Escreva o **primeiro registro** pós-onboarding, pra memória começar populada:

```markdown
## ✅ Último passo concluído
Onboarding concluído — negócio **{business_name}** mapeado (empresa, fundação de marca,
ICP, produto, design system + brandbook).

## ➡️ Próximo passo
Revisar os campos pendentes (FILL_LATER) e/ou começar a usar o design system nas páginas.
```

> Se o `PROGRESS.md` não existir (aliado sem os arquivos-base), crie-o a partir do modelo.
> Não toque nas regras do `CLAUDE.md` base (memória + roteamento) — apenas acrescente o
> bloco de contexto do negócio (Passo 2).

### Passo 4 — Confirmar ao aliado

> "Pronto! Criei uma regra no `CLAUDE.md` do seu repo: a partir de agora, qualquer
> conversa com a IA aqui já vai conhecer seu negócio automaticamente — sem te perguntar
> de novo o que você já respondeu. E registrei onde paramos no `PROGRESS.md`, pra nunca
> recomeçar do zero. Seus dados estão vivos. 🚀"

Atualize `state.yaml`: `phases_done += "activate_context"`, `current_phase: "done"`.
Depois siga para o ENCERRAMENTO do onboard-chief.

## Acceptance Criteria

1. `CLAUDE.md` na raiz contém o bloco gerenciado (criado, anexado ou substituído — nunca sobrescrevendo o resto).
2. Operação **idempotente**: rodar de novo não duplica o bloco.
3. `INDEX.md` criado em `workspace/businesses/{slug}/`.
4. `{business_name}` e `{slug}` substituídos pelos valores reais.

## Outputs

| Output | Descrição |
|--------|-----------|
| `CLAUDE.md` (raiz) | Regra que mantém o contexto vivo em toda sessão futura |
| `workspace/businesses/{slug}/INDEX.md` | Mapa de leitura rápida do negócio |

---
*Task da squad onboard-aliado — onboard-chief*
