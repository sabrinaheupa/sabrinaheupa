# Task: Elicitar Perfil da Empresa

```yaml
task:
  id: elicit-company-profile
  name: Perfil da empresa, fundador e produto principal
  agent: onboard-chief
  elicit: true
  order: 2
  output_format: yaml
```

## Descrição

Fase 2. Coleta a essência da empresa, a história/voz do fundador e o produto principal,
usando as perguntas de `data/question-bank.yaml` (seções `company_profile` e `product`)
com o PROTOCOLO_DE_AJUDA sempre ativo.

## Pré-requisitos

- `business_type` definido (fase 1).
- `data/question-bank.yaml` carregado.

## Workflow

### Passo 1 — Conduzir as perguntas

Percorra, NA ORDEM, com ritmo de conversa (não como formulário):

**Empresa (company_profile):** trade_name, one_liner, origin_story, mission, vision, positioning
**Produto (product):** main_offer, price, transformation

Para CADA pergunta:
1. Faça a pergunta (campo `q`), em linguagem leve.
2. Se o aliado responder → registre.
3. Se travar/pedir ajuda → **PROTOCOLO_DE_AJUDA**: use `why`, `examples_by_type[{business_type}]`
   e, se ele quiser, monte um rascunho `[SUGERIDO_IA]`.
4. Após cada resposta, salve incrementalmente nos YAMLs (passo 2) e atualize o `state.yaml`.

> Regra: nunca despeje as 9 perguntas de uma vez. Agrupe em 2-3 blocos curtos no máximo,
> ou uma a uma. Celebre o progresso ("boa, isso já deixa seu posicionamento claro").

### Passo 2 — Gravar nos documentos

**`company/company-profile.yaml`:**

```yaml
metadata:
  schema: onboard-aliado.company-profile
  slug: "{slug}"
  business_type: "{tipo}"
  status: IN_PROGRESS
  updated_at: "{data}"
company_essence:
  trade_name: "{...}"
  one_liner: "{...}"
vision:
  mission: "{...}"
  statement: "{...}"            # visão de 3-5 anos
positioning:
  unique_angle: "{...}"
  # campos sem resposta confirmada: FILL_LATER
```

**`company/founder-dna.yaml`:**

```yaml
metadata:
  schema: onboard-aliado.founder-dna
  slug: "{slug}"
  status: IN_PROGRESS
  updated_at: "{data}"
founder_name: "{founder_name}"
origin_story: "{...}"
# voz/filosofia podem ser enriquecidas depois (FILL_LATER)
```

**`products/{produto_slug}.yaml`:** (use um slug do nome da oferta)

```yaml
metadata:
  schema: onboard-aliado.product
  slug: "{slug}"
  status: IN_PROGRESS
  updated_at: "{data}"
offer:
  name: "{...}"
  description: "{main_offer}"
  price: "{price}"
  transformation: "{transformation}"
```

> Marcações obrigatórias: campo vazio confirmado = `FILL_LATER`; rascunho da IA não
> confirmado = prefixo `[SUGERIDO_IA]` no valor.

### Passo 3 — Atualizar progresso

Atualize `state.yaml`:

```yaml
current_phase: 3
phases_done: [..., "company_profile"]
completeness:
  company_profile: {0-100, % de campos preenchidos com dado real}
fill_later: [{ids dos campos pendentes}]
updated_at: "{data}"
```

### Passo 4 — Transição

> "Show! Já tenho o esqueleto do seu negócio. Agora vamos à alma da marca — no que
> você acredita, o que defende, como sua marca fala. É o que vai dar posição (não só
> produto) pra tudo que a gente criar depois."

Acione o **brand-strategist** (fase 3 — Fundação de Marca).

## Acceptance Criteria

1. Todas as 9 perguntas percorridas (respondidas OU marcadas FILL_LATER com ajuda oferecida).
2. `company-profile.yaml`, `founder-dna.yaml` e `products/{produto}.yaml` criados.
3. PROTOCOLO_DE_AJUDA acionado sempre que o aliado travou.
4. `state.yaml` com completeness atualizada.

## Outputs

| Output | Descrição |
|--------|-----------|
| `company/company-profile.yaml` | Essência, missão, visão, posicionamento |
| `company/founder-dna.yaml` | Nome e história do fundador |
| `products/{produto}.yaml` | Oferta principal |

---
*Task da squad onboard-aliado — onboard-chief*
