---
name: onboard-aliado
description: |
  Onboarding de negócio para aliados (mentorandos). Conduz uma entrevista
  conversacional que descobre o tipo de negócio, pesquisa o mercado de verdade
  (concorrentes, preços, linguagem do cliente) e preenche os documentos
  fundamentais: perfil da empresa, DNA do fundador, ICP profundo, produto e um
  design system portátil (cores, tipografia, guidelines). Em qualquer pergunta o
  aliado pode pedir ajuda e os agentes ajudam a responder. 100% portátil — roda em
  qualquer repo com AIOX básico, sem depender de outras squads ou apps.
user-invocable: true
version: "1.0.0"
---

# /onboard-aliado — Onboarding de negócio do aliado

## Propósito

Dar à IA do aliado o "cérebro" do negócio dele: quem é, o que vende, pra quem, e a
cara da marca. Ao final, os documentos fundamentais ficam preenchidos em
`workspace/businesses/{slug}/` e qualquer agente do AIOX passa a operar com contexto real.

## Como ativar

Esta skill ativa a squad portátil `squads/onboard-aliado/`. Ao ser invocada:

1. **Leia integralmente** `squads/onboard-aliado/agents/onboard-chief.md` e **adote a persona**
   do `onboard-chief` (orquestrador). Toda a configuração necessária está nesse arquivo.
2. **Verifique retomada:** procure `workspace/businesses/*/onboard/state.yaml`. Se existir um
   onboarding em andamento, ofereça retomar de onde parou (não recomece do zero).
3. **Exiba o greeting** do `onboard-chief` e **PARE**, aguardando o aliado.
4. Conduza o fluxo de 6 fases descrito no chief, acionando os agentes/tasks de cada fase:
   - Fase 0 → `tasks/bootstrap-aliado.md`
   - Fase 1 → `business-detector` + `tasks/detect-business-type.md`
   - Fase 2 → `tasks/elicit-company-profile.md`
   - Fase 3 → `brand-strategist` + `tasks/elicit-brand-foundation.md` (manifesto, valores, crenças, voz)
   - Fase 4 → `market-researcher` + `tasks/research-market.md`
   - Fase 5 → `icp-extractor` + `tasks/extract-icp-deep.md`
   - Fase 6 → `brand-translator` + `tasks/translate-to-brand.md` + `tasks/generate-design-system.md` (+ brandbook.html rico)
   - Fase 6b (opcional) → `tasks/integrate-design-starter.md` (só se `apps/aiox-design-starter/` existir)
   - Fase 7 (obrigatória) → `tasks/activate-context.md` (gera CLAUDE.md anti-dado-morto + INDEX.md)

## Regra de ouro — Ajuda conversacional

Em **qualquer** pergunta, se o aliado travar, pedir ajuda, perguntar de volta ou dizer
"não sei", siga o **PROTOCOLO_DE_AJUDA** definido em `agents/onboard-chief.md`: explique,
mostre exemplos do tipo de negócio dele e ofereça um rascunho de resposta com base na
pesquisa de mercado. Nunca cobre, nunca envergonhe.

## Princípios

- **Portátil:** nunca referencie um negócio específico (ex: "omni"). Tudo via `{slug}`.
- **Sem invenção:** campo sem resposta confirmada = `FILL_LATER`; sugestão da IA = `[SUGERIDO_IA]`;
  dado de pesquisa = com fonte (URL) ou `[SEM_FONTE]`.
- **Curadoria > volume:** uma resposta verdadeira vale mais que dez campos no chute.
- **Pausar/retomar:** salve `onboard/state.yaml` após cada passo.

## Arquivos da squad

```
squads/onboard-aliado/
├── config.yaml
├── README.md
├── agents/  (onboard-chief, business-detector, brand-strategist, market-researcher, icp-extractor, brand-translator)
├── tasks/   (bootstrap, detect-business-type, elicit-company-profile, elicit-brand-foundation,
│             research-market, extract-icp-deep, translate-to-brand, generate-design-system,
│             integrate-design-starter, activate-context)
├── data/    (business-types, brand-archetypes, question-bank)
└── assets/  (brandbook-template.html — template editorial pronto do brandbook)
```
