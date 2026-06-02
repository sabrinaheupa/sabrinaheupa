# Task: Traduzir para Marca (Arquétipo + Direção Visual)

```yaml
task:
  id: translate-to-brand
  name: Arquétipo de marca e direção visual
  agent: brand-translator
  elicit: true
  order: 6
  output_format: yaml
```

## Descrição

Fase 6 (parte 1). Define o arquétipo de marca a partir da **fundação de marca**
(brand-foundation.yaml) + posicionamento + ICP e conduz um wizard leve de direção visual
(cor, tipografia, mood). Estratégia antes de estética. O output alimenta a task `generate-design-system`.

## Pré-requisitos

- `brand/brand-foundation.yaml`, `company-profile.yaml`, `icp.yaml`, `market/research.yaml` existem.
- `data/brand-archetypes.yaml` carregado.

## Workflow

### Passo 1 — Propor arquétipo (com justificativa)

Leia `brand-foundation.yaml` (essence, values, voice, positioning) + `positioning.unique_angle` +
`icp.archetypes` + `research.synthesis`. A **essência + a voz** são o maior insumo do arquétipo.
Escolha 1 arquétipo **primário** + 1 **secundário** de `brand-archetypes.yaml`
(use `mapping_hints`). Apresente assim:

> "Pelo seu posicionamento ({…}) e seu cliente ({icp_name}), sua marca tem cara de
> **{arquétipo primário}** com um toque de **{secundário}**. Isso significa uma marca
> {mood}. Faz sentido pra você? (posso trocar se você sente diferente)"

Aguarde validação. Se o aliado discordar, ofereça 1-2 alternativas e ajuste.

### Passo 2 — Wizard de direção visual (PROTOCOLO_DE_AJUDA ativo)

Cada item já vem com um DEFAULT pronto vindo do arquétipo — o aliado pode só dizer
"pode ser" e seguir:

1. **Cor principal** — "A cor que mais traduz sua marca? Pode ser um hex, um nome
   ('dourado'), ou uma sensação ('terroso e quente'). Sugiro `{color_direction do arquétipo}`."
   → converta para HEX.
2. **Paleta** — proponha 4-6 cores a partir da principal + arquétipo (fundo, texto,
   acento, apoio). Mostre e peça aprovar/ajustar.
3. **Tipografia** — sugira 2-3 combos (display + corpo) alinhados ao `typography_direction`.
   Prefira fontes Google Fonts (gratuitas) para portabilidade web.
4. **Mood/tom** — confirme o sentimento (premium, acolhedor, ousado, leve…).
5. **Logo** — "Tem logo? Me descreve ou manda depois. Se não tiver, seguimos sem —
   registro como pendência."

### Passo 3 — Consolidar a direção (rascunho para a próxima task)

Monte um resumo (não é arquivo final ainda, é insumo para generate-design-system):

```yaml
brand_direction:
  archetype_primary: "{...}"
  archetype_secondary: "{...}"
  mood: "{...}"
  colors:
    primary: "#{hex}"
    background: "#{hex}"
    text: "#{hex}"
    accent: "#{hex}"
    support: ["#{hex}", "#{hex}"]
  typography:
    display: { family: "{...}", source: "Google Fonts | sistema", weight: "{...}" }
    body: { family: "{...}", source: "{...}", weight: "{...}" }
  logo:
    status: "tem | descrever | pendente"
    description: "{... ou FILL_LATER}"
```

> Cores/fontes sugeridas pela IA = `[SUGERIDO_IA]` até o aliado confirmar.

### Passo 4 — Transição

> "Fechou a direção! Agora vou transformar isso num design system de verdade —
> arquivos prontos pra você usar em qualquer página ou material."

Acione a task **generate-design-system**.

## Acceptance Criteria

1. Arquétipo primário + secundário definidos e **validados** pelo aliado.
2. Direção visual (cores, tipografia, mood) consolidada.
3. Cada sugestão da IA marcada `[SUGERIDO_IA]` até confirmação.

## Outputs

| Output | Descrição |
|--------|-----------|
| `brand_direction` (insumo) | Passado para generate-design-system |

---
*Task da squad onboard-aliado — brand-translator*
