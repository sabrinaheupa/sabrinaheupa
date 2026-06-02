# Task: Fundação de Marca

```yaml
task:
  id: elicit-brand-foundation
  name: Manifesto, valores, crenças, missão, visão e voz
  agent: brand-strategist
  elicit: true
  order: 3
  output_format: yaml
```

## Descrição

Fase 3. Extrai a **fundação estratégica da marca** — o material "de alma" que o perfil
da empresa não cobre. Modelado no `brandbook.yaml` da OMNI (subset essencial). Roda com
o PROTOCOLO_DE_AJUDA sempre ativo (é a fase onde mais gente trava).

## Pré-requisitos

- `company-profile.yaml` e `founder-dna.yaml` existem (fase 2).
- Seção `brand_foundation` de `data/question-bank.yaml` carregada.

## Workflow

### Passo 1 — Conduzir as perguntas (NA ORDEM, com provocação)

Use a seção `brand_foundation` do question-bank: **enemy → manifesto → purpose →
essence → values → beliefs → voice**.

Conduza como conversa que arranca convicção, não como formulário:
- Reaproveite a `origin_story` (founder-dna) e o `positioning` (company-profile) para provocar.
- **Valores:** aplique o teste do oposto — "alguém sério consegue discordar disso?" Se não, é clichê → reescrever.
- **Manifesto:** se vier morno, provoque com o `enemy` até ter tensão/posição.
- **Voz:** destile do jeito que o PRÓPRIO fundador fala.

> PROTOCOLO_DE_AJUDA: capriche nos rascunhos `[SUGERIDO_IA]` — monte um manifesto/valor
> forte a partir do que ele já contou e deixe ele só aprovar ou ajustar.

### Passo 2 — Montar e VALIDAR antes de salvar

Monte a fundação e **devolva ao aliado** ("é isso que você defende? ajusta o que não bateu").
Só salve como final após o ok.

### Passo 3 — Gravar `brand/brand-foundation.yaml`

```yaml
metadata:
  schema: onboard-aliado.brand-foundation
  slug: "{slug}"
  status: IN_PROGRESS
  updated_at: "{data}"
core:
  mission: "{por que existe}"
  vision: "{onde quer chegar}"
  purpose: "{a causa maior}"
  essence: "{1-3 palavras}"
manifesto:
  short: "{1-2 frases — o grito da marca}"
  text: "{versão longa — 1 parágrafo}"
  cta: "{convocação final, opcional}"
values:
  - name: "{nome do valor}"
    principle: "{princípio acionável — algo que dá pra discordar}"
  # 4 a 6 valores
beliefs:
  - "{crença/princípio 1}"
  - "{crença 2}"
  - "{crença 3}"
voice:
  personality: "{2-3 adjetivos do tom}"
  signature_phrases: ["{frase que é a cara da marca}"]
  forbidden_words: ["{palavras que a marca nunca usa}"]
  tone_dimensions:
    warmth: "{baixo|médio|alto}"
    formality: "{baixo|médio|alto}"
    directness: "{baixo|médio|alto}"
positioning:
  enemy: "{contra o que/quem a marca se posiciona}"
  why: "{nível 1 — a crença central}"
  how: "{nível 2 — como entrega}"
  what: "{nível 3 — o que é, concretamente}"
```

> Campos sem dado confirmado = `FILL_LATER`. Rascunhos da IA = `[SUGERIDO_IA]`.
> Valor sem princípio acionável NÃO entra — vira clichê.

### Passo 4 — Atualizar progresso e transicionar

`state.yaml`: `completeness.brand_foundation`, `phases_done += "brand_foundation"`, `current_phase: 4`.

> "Essa é a alma da sua marca — agora ela tem posição, não só produto. Vou pesquisar
> seu mercado pra deixar o resto ainda mais afiado."

Acione o **market-researcher** (fase 4).

## Acceptance Criteria

1. `brand/brand-foundation.yaml` criado com manifesto, core (mission/vision/purpose/essence), values, beliefs, voice, positioning.
2. Valores passaram no teste do oposto (não são clichês).
3. Manifesto tem tensão/posição (conectado ao `enemy`).
4. Fundação **validada pelo aliado** antes de salvar como final.

## Outputs

| Output | Descrição |
|--------|-----------|
| `brand/brand-foundation.yaml` | Manifesto, missão, visão, propósito, essência, valores, crenças, voz, posicionamento |

---
*Task da squad onboard-aliado — brand-strategist*
