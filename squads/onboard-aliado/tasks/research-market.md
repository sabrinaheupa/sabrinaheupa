# Task: Pesquisa de Mercado

```yaml
task:
  id: research-market
  name: Inteligência de mercado fundamentada
  agent: market-researcher
  elicit: false
  order: 4
  output_format: yaml
```

## Descrição

Fase 4. Pesquisa o mercado do aliado na web e produz `market/research.yaml` com
concorrentes, faixa de preço, voz do cliente e objeções — tudo com fonte. Esse
documento alimenta o PROTOCOLO_DE_AJUDA das fases seguintes (rascunhos fundamentados).

## Pré-requisitos

- `company-profile.yaml` existe (nicho, oferta, posicionamento).
- Ferramenta de busca web disponível (degrada com elegância se ausente — ver abaixo).

## Workflow

### Passo 1 — Localizar a ferramenta de busca

Descubra o que está disponível (nesta ordem — **free e sem config primeiro**):

1. `WebSearch` nativo (free, sem chave) — carregar via ToolSearch: `select:WebSearch,WebFetch`
2. `WebFetch` para abrir uma página pública específica (review, thread, blog)
3. EXA via MCP (`mcp__docker-gateway__web_search_exa`) — **só se já estiver configurado** (não é requisito)

> **Degradação:** se NENHUMA busca estiver disponível, pule para o Passo 5 (modo limitado):
> gere o research.yaml por inferência, marque tudo como `[SEM_FONTE]` e avise o aliado.

### Passo 2 — Montar as queries multi-fonte (free, via WebSearch)

Use `one_liner`, `main_offer` e `business_type` para buscar em FONTES DIFERENTES — cada
ângulo revela algo que o outro não pega:

**Concorrência e preço:**
- "{nicho} concorrentes Brasil" · "{categoria do produto} preço quanto custa" · "{nicho} melhores / comparação / vale a pena"

**Voz do cliente (gratuita, alto sinal):**
- Reddit/fóruns: `site:reddit.com {nicho ou dor}` · "{dor} fórum"
- Reviews/objeções: "{concorrente} reclame aqui" · "{concorrente} trustpilot" · "{produto} avaliações"
- YouTube: "{nicho} depoimento / análise / experiência youtube"
- Posts públicos indexados: "{nicho} instagram / tiktok" (parcial — só o indexado)

> Direto de API de IG/TikTok/X **não** — exige chave/infra. Pegue o que vem indexado via busca.
> Foque no nicho — pesquisa cirúrgica, não enciclopédia. Curadoria > volume.

### Passo 3 — Coletar e curar

Para cada achado relevante, registre: fato + URL + confidence (ALTA/MEDIA/BAIXA) + data.
Curadoria > volume: 3-7 concorrentes fortes, não 30 fracos.

### Passo 4 — Sintetizar lacunas

Identifique o que os concorrentes **não** oferecem → oportunidade de posicionamento
para o aliado (insight estratégico, não só descrição).

### Passo 5 — Gravar `market/research.yaml`

```yaml
metadata:
  schema: onboard-aliado.market-research
  slug: "{slug}"
  business_type: "{tipo}"
  mode: "FULL | LIMITED"          # LIMITED = sem busca web disponível
  generated_at: "{data}"
competitors:
  - name: "{...}"
    offer: "{...}"
    price_range: "{...}"
    positioning: "{...}"
    source: "{URL}"
    confidence: "ALTA|MEDIA|BAIXA"
price_landscape:
  range_observed: "{R$X – R$Y}"
  notes: "{...}"
  sources: ["{URL}", "{URL}"]
voice_of_customer:
  # frases REAIS do cliente, com a fonte e de ONDE veio (reddit/review/youtube/forum/social/web)
  signals:
    - quote: "{frase real do cliente, nas palavras dele}"
      type: "pain | desire | objection"
      source_type: "reddit | review | youtube | forum | social | web"
      source: "{URL}"
  pains_in_real_words: ["{resumo das dores em palavras reais}"]
  desires_in_real_words: ["{resumo dos desejos em palavras reais}"]
common_objections: ["{...}", "{...}"]
positioning_gaps:
  - opportunity: "{o que ninguém oferece}"
    rationale: "{por que é uma brecha}"
synthesis: "{2-4 frases: como o aliado pode se posicionar dado o mercado}"
```

> Sem fonte verificável → `[SEM_FONTE]` no campo e `confidence: BAIXA`.

### Passo 6 — Apresentar e transicionar

Mostre ao aliado um resumo de 3-5 bullets ("achei isso no seu mercado: ...") e diga
que vai usar isso pra ajudar nas próximas respostas. Acione o **icp-extractor** (fase 5).

## Acceptance Criteria

1. `market/research.yaml` criado com `mode` correto (FULL ou LIMITED).
2. Cada fato com fonte OU marcado `[SEM_FONTE]`.
3. Voz do cliente buscada em **pelo menos 2 tipos de fonte** (ex.: reddit + reviews), quando em modo FULL.
4. Pelo menos 1 `positioning_gap` identificado (oportunidade).
5. Resumo apresentado ao aliado.

## Outputs

| Output | Descrição |
|--------|-----------|
| `market/research.yaml` | Concorrentes, preços, voz do cliente, objeções, lacunas |

---
*Task da squad onboard-aliado — market-researcher*
