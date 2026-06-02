# Squad onboard-aliado 🧭

Onboarding de negócio para aliados (mentorandos). Uma entrevista conversacional que
descobre o tipo de negócio, **pesquisa o mercado de verdade** e preenche os documentos
fundamentais do negócio + um **design system portátil**.

> **100% portátil.** Roda em qualquer repo com AIOX básico instalado. Não depende de
> nenhuma outra squad, agente ou app.

---

## O que ela entrega

Ao final, em `workspace/businesses/{slug}/`:

| Documento | Conteúdo |
|---|---|
| `company/company-profile.yaml` | Essência, missão, visão, posicionamento |
| `company/founder-dna.yaml` | Nome e história do fundador |
| `brand/brand-foundation.yaml` | Manifesto, missão, visão, valores, crenças, voz, posicionamento |
| `company/icp.yaml` | Cliente ideal profundo (a parte mais importante) |
| `products/{produto}.yaml` | Oferta principal (preço, transformação) |
| `market/research.yaml` | Concorrentes, preços, voz do cliente, objeções, lacunas |
| `design-system/config.yaml` | Tokens de cor, tipografia, componentes |
| `design-system/tokens.css` | Variáveis CSS prontas para uso |
| `design-system/visual-guidelines.yaml` | Arquétipo, princípio visual, regras de logo |
| `design-system/brandbook.html` | **Página visual** do design system — abre no navegador (clique duplo), sem app/build |
| `onboard/state.yaml` | Progresso (permite pausar e retomar) |
| `INDEX.md` (do negócio) | Mapa de leitura rápida dos documentos |
| **`CLAUDE.md`** (raiz do repo) | **Regra anti-dado-morto:** toda sessão futura lê o contexto e nunca repergunta |

---

## Como instalar no repo de um aliado

O repo do aliado precisa ter apenas o **AIOX básico** (pasta `.claude/`). Copie **duas pastas**:

```bash
# A partir da raiz do repo do aliado, com os caminhos de ORIGEM ajustados:

# 1) A squad (lógica, agentes, tasks, dados)
cp -R /caminho/origem/squads/onboard-aliado  squads/onboard-aliado

# 2) A skill (ponto de entrada /onboard-aliado)
cp -R /caminho/origem/.claude/skills/onboard-aliado  .claude/skills/onboard-aliado
```

Estrutura esperada após copiar:

```
repo-do-aliado/
├── .claude/
│   └── skills/
│       └── onboard-aliado/
│           └── SKILL.md
└── squads/
    └── onboard-aliado/
        ├── config.yaml
        ├── README.md
        ├── agents/   (6 arquivos)
        ├── tasks/    (10 arquivos)
        ├── data/     (3 arquivos)
        └── assets/   (brandbook-template.html — template editorial)
```

Nada mais é necessário. Sem instalação, sem dependências de outras squads.

---

## Como o aliado usa

No Claude Code, dentro do repo, o aliado digita:

```
/onboard-aliado
```

A IA assume a persona do guia e conduz a entrevista em 6 fases. O aliado pode:

- **Pedir ajuda em qualquer pergunta** — "me ajuda", "não sei", "dá um exemplo".
  A IA explica, dá exemplos do tipo de negócio dele e sugere uma resposta com base na
  pesquisa de mercado.
- **Pausar e retomar** — basta digitar `/onboard-aliado` de novo; retoma de onde parou.
- **Pular uma pergunta** — `*pular` (registra como pendência).
- **Ver progresso** — `*status`.

---

## As 6 fases

| Fase | Agente | O que faz |
|---|---|---|
| 0. Bootstrap | onboard-chief | Cria pastas, captura nome/slug, inicia estado |
| 1. Tipo | business-detector | Classifica o tipo de negócio (3-4 perguntas) |
| 2. Empresa | onboard-chief | Perfil, fundador, produto principal |
| 3. Fundação | brand-strategist | Manifesto, missão, visão, valores, crenças, voz |
| 4. Mercado | market-researcher | Pesquisa web: concorrentes, preços, voz do cliente |
| 5. ICP | icp-extractor | Cliente ideal profundo (via casos reais) |
| 6. Marca | brand-translator | Arquétipo + design system + brandbook.html rico |
| 6b. (opcional) | brand-translator | Variant no design-starter, **só se o app existir** |
| 7. Contexto | onboard-chief | Gera `CLAUDE.md` (regra anti-dado-morto) + `INDEX.md` |

---

## Requisitos e degradação

- **AIOX básico** (`.claude/`) — obrigatório.
- **Busca web** (EXA via MCP ou WebSearch nativo) — recomendada para a fase 3. Se ausente,
  a pesquisa roda em **modo limitado** (inferência marcada `[SEM_FONTE]`, confirmada com o aliado).
- **apps/aiox-design-starter/** — **opcional**. Se presente, gera a brandbook page navegável;
  se ausente, o design system fica nos arquivos portáteis (config.yaml + tokens.css).

---

## Princípios de qualidade

- **Sem invenção:** campo sem resposta = `FILL_LATER`; sugestão da IA = `[SUGERIDO_IA]`;
  dado de pesquisa = com fonte ou `[SEM_FONTE]`.
- **Curadoria > volume:** resposta verdadeira > campo preenchido no chute.
- **ICP é prioridade:** é o dado que mais impacta tudo a jusante (copy, ads, design).
- **Estratégia antes de estética:** o design vem do posicionamento + ICP, não de gosto pessoal.

---
*Squad onboard-aliado v1.0.0 — OMNI Brasil*
