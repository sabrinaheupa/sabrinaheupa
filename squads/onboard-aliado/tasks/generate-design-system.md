# Task: Gerar Design System Portátil

```yaml
task:
  id: generate-design-system
  name: Escrever o design system (YAML + CSS portáteis)
  agent: brand-translator
  elicit: false
  order: 7
  output_format: multi
```

## Descrição

Fase 6 (parte 2). Transforma a `brand_direction` em arquivos portáteis em
`workspace/businesses/{slug}/design-system/`. Zero dependência de app — funciona em
qualquer repo. **Não gera `.ts`** (é justamente o que evita o problema de hardcoding).

## Pré-requisitos

- `brand_direction` consolidada (task translate-to-brand).

## Workflow

### Passo 1 — Escrever `design-system/config.yaml`

```yaml
id: "{slug}-ds"
name: "{business_name} Design System"
source: "onboard-aliado — fase 5"
default_theme: "main"
metadata:
  schema: onboard-aliado.design-system
  version: "1.0"
  status: ACTIVE
  archetype_primary: "{...}"
  archetype_secondary: "{...}"
  mood: "{...}"
  updated_at: "{data}"
color_tokens:
  primary:    { value: "#{hex}", role: "Acento principal — CTAs, destaques" }
  background: { value: "#{hex}", role: "Fundo primário" }
  surface:    { value: "#{hex}", role: "Cards, seções alternadas" }
  text:       { value: "#{hex}", role: "Texto principal" }
  text_muted: { value: "#{hex}", role: "Texto secundário" }
  accent:     { value: "#{hex}", role: "Apoio / segundo destaque" }
typography:
  display:
    family: "{...}"
    fallback: "{...}"
    weight: "{...}"
    source: "Google Fonts | sistema"
    import_css: "{@import url(...) se Google Fonts}"
    usage: "Títulos, headlines"
  body:
    family: "{...}"
    fallback: "sans-serif"
    weight: "{...}"
    source: "{...}"
    usage: "Texto corrido"
spacing:
  base_unit: 8px
  scale: [4, 8, 16, 24, 32, 48, 64, 96]
  container_max_width: "1200px"
border_radius:
  soft: "6px"
  card: "12px"
  pill: "999px"
components:
  button_primary:
    background: primary
    text: background
    radius: soft
    padding: "14px 32px"
  card:
    background: surface
    radius: card
    padding: "24px"
```

### Passo 2 — Escrever `design-system/tokens.css`

Gere as variáveis CSS a partir do config (valores reais, não referências):

```css
/* {business_name} — Design Tokens
   Gerado por onboard-aliado. Arquétipo: {primário} + {secundário}. */
:root {
  /* Cores */
  --color-primary: #{hex};
  --color-background: #{hex};
  --color-surface: #{hex};
  --color-text: #{hex};
  --color-text-muted: #{hex};
  --color-accent: #{hex};

  /* Tipografia */
  --font-display: "{display.family}", {fallback};
  --font-body: "{body.family}", {fallback};

  /* Espaçamento */
  --space-1: 4px;  --space-2: 8px;  --space-3: 16px; --space-4: 24px;
  --space-5: 32px; --space-6: 48px; --space-7: 64px; --space-8: 96px;
  --container-max: 1200px;

  /* Raio */
  --radius-soft: 6px; --radius-card: 12px; --radius-pill: 999px;
}

/* Imports de fonte (se Google Fonts) */
/* @import url('...'); → coloque no topo do CSS ou no <head> */

body { background: var(--color-background); color: var(--color-text); font-family: var(--font-body); }
h1, h2, h3 { font-family: var(--font-display); color: var(--color-text); }
.btn-primary { background: var(--color-primary); color: var(--color-background); border-radius: var(--radius-soft); padding: 14px 32px; border: 0; cursor: pointer; }
.card { background: var(--color-surface); border-radius: var(--radius-card); padding: var(--space-4); }
```

### Passo 3 — Escrever `design-system/visual-guidelines.yaml`

```yaml
metadata:
  schema: onboard-aliado.visual-guidelines
  slug: "{slug}"
  version: "1.0"
  status: ACTIVE
  updated_at: "{data}"
design_principle: "{1 frase que resume a marca, ex: 'Cuidado com método'}"
archetype:
  primary: "{...}"
  secondary: "{...}"
  expression: "{como o arquétipo se traduz visualmente}"
mood: "{...}"
logo:
  status: "{tem | pendente}"
  description: "{... ou FILL_LATER}"
  usage_rules:
    - "{regra básica, ex: zona de respiro mínima, não distorcer}"
do:
  - "{uso recomendado, ex: fundo escuro com acento na cor primária}"
dont:
  - "{o que evitar, derivado do arquétipo (campo 'avoid')}"
```

### Passo 4 — Gerar `design-system/brandbook.html` a partir do TEMPLATE

> **REGRA DE OURO (não negociável):** NÃO escreva o HTML/CSS do zero. Use o template
> profissional pronto em `assets/brandbook-template.html` e apenas **injete os dados**.
> Escrever do zero é o que produz "cara de IA" e resultado inconsistente. O craft visual
> (layout editorial, tipografia, espaçamento, motions) já está no template e NÃO se mexe.

Procedimento:

1. **Copie** `squads/onboard-aliado/assets/brandbook-template.html` →
   `workspace/businesses/{slug}/design-system/brandbook.html`.
   ```bash
   cp squads/onboard-aliado/assets/brandbook-template.html \
      "workspace/businesses/{slug}/design-system/brandbook.html"
   ```
   (Se rodando de outro cwd, ajuste o caminho do template; ele vive dentro da squad.)

2. **Troque as fontes:** no `<link>` do Google Fonts e nas vars `--font-display` /
   `--font-body` do `:root`, use as fontes reais do `config.yaml`. (Default do template:
   Fraunces + Inter — troque pela combinação do arquétipo.)

3. **Troque as cores:** no bloco `:root`, substitua os HEX `--c-primary, --c-background,
   --c-surface, --c-text, --c-muted, --c-line, --c-accent` pelos tokens reais do `config.yaml`.
   (Se o negócio não tiver `--c-line`, derive um tom claro do texto/fundo.)

3b. **Perfil de motion** — substitua `{{MOTION_PROFILE}}` no `<body>` pelo perfil do
   arquétipo PRIMÁRIO (o CSS dos 3 já está no template):
   - `subtle` → Sábio, Ruler, Cuidador, Inocente (sutil, lento, elegante)
   - `bold`   → Herói, Rebelde, Mago (forte, rápido, com overshoot)
   - `soft`   → Amante, Criador, Explorador, Jester (orgânico, fluido)
   Na dúvida, `subtle`. Assim a energia da animação combina com a personalidade da marca.

4. **Substitua os marcadores `{{...}}`** pelos valores reais:
   - De `company-profile.yaml`: `{{BRAND_NAME}}`, `{{PRINCIPLE}}` (one_liner/design_principle)
   - De `visual-guidelines.yaml`: `{{ESSENCE}}`, `{{ARCHETYPE_PRIMARY}}`, `{{ARCHETYPE_SECONDARY}}`, `{{MOOD}}`, `{{IMAGERY_DESC}}`, `{{LOGO_*}}`, `{{DO_ITEM}}`, `{{DONT_ITEM}}`
   - De `brand-foundation.yaml`: `{{MANIFESTO_SHORT}}`, `{{MANIFESTO_TEXT}}`, `{{MANIFESTO_CTA}}`, `{{VALUE_*}}`, `{{VOICE_PERSONALITY}}`, `{{SIGNATURE_PHRASE}}`, `{{FORBIDDEN_WORD}}`, `{{VOICE_DO}}`
   - Amostras de tipografia (`{{TYPE_SAMPLE_*}}`): use frases reais da marca (ex.: a essência, uma signature phrase).
   - Slides: `{{SLIDE_COVER_TITLE}}` (essência/promessa), `{{SLIDE_QUOTE}}` (signature phrase), `{{SLIDE_DATA_NUM}}`/`{{SLIDE_DATA_LABEL}}` (uma métrica real — ou um número da oferta, ex.: "35 dias").

5. **Expanda os blocos `<!-- REPEAT:x -->`:** duplique o item interno uma vez por elemento
   da lista (valores, swatches de cor, frases, palavras proibidas, do, dont, regras de logo).
   Numere `vn` dos valores (01, 02, ...).

6. **Verifique:** abra o arquivo mentalmente — nenhum `{{...}}` pode sobrar; cada `<!-- REPEAT -->`
   foi expandido; os HEX do `:root` batem com os swatches. Remova os comentários `<!-- REPEAT -->`.

> O template é responsivo, tem motions (glow/float/shimmer/fade-up no scroll), respeita
> `prefers-reduced-motion` e é autocontido. Você só injeta dados — o resultado sai
> profissional **de primeira**, em qualquer repo.

### Passo 4b — Instruções de deploy no Vercel (grátis, opcional)

Informe ao aliado (não execute sem o ok dele) como publicar o brandbook como site estático:

```bash
# 1. Instalar a CLI do Vercel (uma vez): npm i -g vercel
# 2. Numa pasta com o brandbook como index.html:
cp workspace/businesses/{slug}/design-system/brandbook.html /tmp/brandbook-{slug}/index.html
cd /tmp/brandbook-{slug} && vercel        # segue o login no navegador; deploy estático, sem build
```

> É deploy **estático** (1 arquivo) — não precisa de Next.js, build nem do design-starter.
> Resultado: uma URL pública grátis, no estilo da brandbook da OMNI.

Ao terminar o Passo 4, informe:
> "Seu brandbook visual está em `design-system/brandbook.html` — duplo-clique abre no
> navegador. Quer publicar numa URL grátis? Eu te passo os 2 comandos do Vercel. 🎨"

### Passo 5 — Atualizar estado e encerrar a fase

`state.yaml`: `completeness.design_system`, `phases_done += "design"`, `current_phase: 6`.

Se `has_design_starter == true` → ofereça a integração opcional (task integrate-design-starter).
Senão → vá para o ENCERRAMENTO do onboard-chief.

## Acceptance Criteria

1. Os **4** arquivos criados em `design-system/` (config.yaml, tokens.css, visual-guidelines.yaml, brandbook.html).
2. `tokens.css` com valores HEX reais (não placeholders) e variáveis utilizáveis.
3. `brandbook.html` autocontido (CSS inline, fontes via `<link>`), abre no navegador sem build, usa os tokens reais e tem as 6 seções.
4. Nenhum arquivo `.ts` gerado; nenhuma dependência de app.
5. `do/dont` derivados do arquétipo.

## Outputs

| Output | Descrição |
|--------|-----------|
| `design-system/config.yaml` | Tokens de cor, tipografia, componentes |
| `design-system/tokens.css` | Variáveis CSS prontas para uso |
| `design-system/visual-guidelines.yaml` | Arquétipo, princípio, regras de logo |
| `design-system/brandbook.html` | **Página visual autocontida** — abre no navegador (clique duplo) |

---
*Task da squad onboard-aliado — brand-translator*
