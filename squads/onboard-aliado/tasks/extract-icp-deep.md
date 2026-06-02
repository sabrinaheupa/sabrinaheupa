# Task: Extração Profunda do ICP

```yaml
task:
  id: extract-icp-deep
  name: Cliente ideal profundo (via casos reais)
  agent: icp-extractor
  elicit: true
  order: 5
  output_format: yaml
```

## Descrição

Fase 5 — a mais profunda. Extrai o cliente ideal via perguntas indiretas (histórias e
casos reais), cruza com a voz do cliente da pesquisa de mercado, e produz
`company/icp.yaml` acionável.

## Pré-requisitos

- `company-profile.yaml` e `market/research.yaml` existem.
- Seção `icp` de `data/question-bank.yaml` carregada.

## Workflow

### Passo 1 — Perguntas indiretas (NA ORDEM)

Conduza como conversa sobre pessoas reais, não sobre definições abstratas:

1. **best_client** — "Me conta do seu MELHOR cliente até hoje: quem é, como chegou, por que deu tão certo?"
2. **fired_client** — "E um que NÃO deu certo, que não atenderia de novo? O que tinha de errado?"
3. **central_pain** — "Qual a dor nº 1 que leva o cliente a te procurar? E o que ele REALMENTE quer por trás disso?"
4. **objections** — "Quais os maiores medos/objeções antes de comprar de você?"
5. (derivada) "O que faz ele decidir comprar AGORA, e não 'depois'?" → action_triggers

Para cada: registre a história e EXTRAIA o padrão (não copie a história crua).

### Passo 2 — Enriquecer com a pesquisa

Cruze com `market/research.yaml → voice_of_customer`:
- Se o aliado descreveu a dor de forma genérica, ofereça os termos REAIS que o mercado
  usa (com a fonte) e pergunte: "é assim que seu cliente fala?".

### Passo 3 — Ajuda para quem nunca vendeu

Se o aliado ainda não tem clientes: PROTOCOLO_DE_AJUDA → peça pra imaginar o cliente
PERFEITO e construa o ICP como hipótese marcada `[SUGERIDO_IA]`, cruzando com a pesquisa.

### Passo 4 — Montar e VALIDAR antes de salvar

Monte o ICP estruturado e **devolva ao aliado para validação** ("foi isso que entendi —
ajusta o que não bateu"). Só salve como final após o ok.

### Passo 5 — Gravar `company/icp.yaml`

```yaml
metadata:
  schema: onboard-aliado.icp
  slug: "{slug}"
  business_type: "{tipo}"
  status: IN_PROGRESS
  updated_at: "{data}"
core_icp:
  one_sentence_definition: "{...}"
  icp_name: "{apelido memorável, ex: 'O Gestor Exausto'}"
  client_type: "{...}"
  average_ticket: "{...}"
demographics:
  age: "{...}"
  geography: "{...}"
  profession: "{...}"
psychographics:
  central_pain:
    what_they_say: "{a dor declarada}"
    what_they_mean: "{o que ele realmente quer}"
    what_they_fear: "{o medo por trás}"
  lifestyle: ["{...}"]
archetypes:
  archetype_1:
    name: "{...}"
    core_issue: "{...}"
    medo_supremo: "{...}"
    desejo_oculto: "{...}"
    frase_conexao: "{frase que faz ele sentir 'é comigo'}"
flags:
  green_flags: ["{sinais de cliente bom}"]
  red_flags: ["{sinais de cliente a evitar}"]
motivations:
  action_triggers: ["{o que faz comprar agora}"]
  paralysis_triggers: ["{o que trava a compra}"]
```

> Campos sem dado confirmado = `FILL_LATER`. Hipóteses da IA = `[SUGERIDO_IA]`.
> Linguagem do cliente sempre vem dele ou da pesquisa (com fonte), nunca de chute não marcado.

### Passo 6 — Atualizar progresso e transicionar

`state.yaml`: `completeness.icp`, `current_phase: 6`, `phases_done += "icp"`.

> "Essa é a parte que vale ouro — agora a IA sabe exatamente com quem seu negócio fala.
> Vamos dar cara a isso: bora montar sua identidade visual."

Acione o **brand-translator** (fase 6).

## Acceptance Criteria

1. As 4-5 perguntas indiretas conduzidas (com ajuda quando necessário).
2. ICP cruzado com a voz do cliente da pesquisa.
3. ICP **validado pelo aliado** antes de salvar como final.
4. `company/icp.yaml` criado e completo (ou com FILL_LATER explícitos).

## Outputs

| Output | Descrição |
|--------|-----------|
| `company/icp.yaml` | Cliente ideal profundo e acionável |

---
*Task da squad onboard-aliado — icp-extractor*
