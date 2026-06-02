# Task: Bootstrap Aliado

```yaml
task:
  id: bootstrap-aliado
  name: Preparar ambiente e iniciar onboarding
  agent: onboard-chief
  elicit: true
  order: 0
  required: true
```

## Descrição

Primeira fase. Detecta o ambiente, cria a estrutura de pastas do negócio, captura o
nome do negócio e do fundador, gera o `slug` e inicia o arquivo de estado. Não faz
perguntas de conteúdo ainda — só prepara o terreno.

## Pré-requisitos

- Nenhum. Roda em repo zerado com AIOX básico.

## Workflow

### Passo 1 — Detectar ambiente

Verifique (sem falhar se algo não existir):

```bash
# A partir da raiz do repo
test -d workspace/businesses && echo "workspace OK" || echo "workspace AUSENTE (será criado)"
test -d apps/aiox-design-starter && echo "design-starter PRESENTE (integração opcional disponível)" || echo "design-starter AUSENTE (integração será pulada)"
```

Registre internamente:
- `has_design_starter: true|false` → decide se a fase 5b roda.

### Passo 2 — Capturar nome do negócio e do fundador

Pergunte (uma de cada vez, leve):
1. "Qual o nome do seu negócio?" → `business_name`
2. "E o seu nome (fundador/responsável)?" → `founder_name`

> PROTOCOLO_DE_AJUDA ativo: se o aliado não tiver nome definido, ajude a criar um
> provisório ou registre `business_name: FILL_LATER` e siga.

### Passo 3 — Gerar slug

Derive o `slug` do `business_name` pela regra: **minúsculas, acentos viram a letra
ASCII equivalente** (í→i, ç→c, ã→a), espaços e símbolos → `_`, mantendo só `a-z0-9_`.

> **Faça você (a IA) a transliteração** — você converte acentos corretamente
> ("Clínica Respiro" → `clinica_respiro`). NÃO dependa de `iconv //TRANSLIT`: no
> macOS (BSD) ele falha e gera slug quebrado (ex.: `cl_inica_respiro`).

Helper portátil (mac + Linux), se quiser confirmar via shell:

```bash
# Funciona em macOS e Linux (usa perl, presente nos dois)
BUSINESS_NAME="Clínica Respiro"
echo "$BUSINESS_NAME" | perl -CS -MUnicode::Normalize -pe '$_=NFD($_); s/\p{NonspacingMark}//g; $_=lc; s/[^a-z0-9]+/_/g; s/^_+|_+$//g'
# → clinica_respiro
```

Confirme com o aliado: "Vou usar o identificador `{slug}` pra organizar tudo — ok?"

### Passo 4 — Criar estrutura de pastas

```bash
SLUG="{slug}"
mkdir -p "workspace/businesses/$SLUG/company" \
         "workspace/businesses/$SLUG/brand" \
         "workspace/businesses/$SLUG/products" \
         "workspace/businesses/$SLUG/market" \
         "workspace/businesses/$SLUG/design-system" \
         "workspace/businesses/$SLUG/onboard"
echo "estrutura criada para $SLUG"
```

### Passo 5 — Iniciar estado

Crie `workspace/businesses/{slug}/onboard/state.yaml`:

```yaml
slug: "{slug}"
business_name: "{business_name}"
founder_name: "{founder_name}"
business_type: null
has_design_starter: {true|false}
current_phase: 1
phases_done: ["bootstrap"]
completeness:
  company_profile: 0
  icp: 0
  design_system: 0
fill_later: []
updated_at: "{data de hoje}"
```

> Para a data, use a data real do sistema (ex.: `date +%F` via Bash) — não invente.

### Passo 6 — Transição

Confirme o início e passe para a fase 1:

> "Pronto, {founder_name}! Ambiente preparado. Agora vou entender rapidinho que
> tipo de negócio é o seu — são só 3-4 perguntas. Bora?"

Acione o **business-detector** (fase 1).

## Acceptance Criteria

1. Pastas de `workspace/businesses/{slug}/` criadas.
2. `state.yaml` válido criado com `business_name`, `founder_name`, `slug`, `has_design_starter`.
3. `has_design_starter` corretamente detectado.
4. Aliado confirmou o slug.

## Outputs

| Output | Descrição |
|--------|-----------|
| `workspace/businesses/{slug}/onboard/state.yaml` | Estado inicial do onboarding |
| Estrutura de pastas | company/, products/, market/, design-system/, onboard/ |

---
*Task da squad onboard-aliado — onboard-chief*
