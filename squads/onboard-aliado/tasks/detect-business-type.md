# Task: Detectar Tipo de Negócio

```yaml
task:
  id: detect-business-type
  name: Classificar o tipo de negócio
  agent: business-detector
  elicit: true
  order: 1
```

## Descrição

Fase 1. Em até 4 perguntas rápidas, classifica o negócio do aliado em um dos 7 tipos
de `data/business-types.yaml`, para adaptar todas as perguntas seguintes.

## Pré-requisitos

- `state.yaml` existe (fase 0 concluída).
- `data/business-types.yaml` carregado.

## Workflow

### Passo 1 — Perguntas de classificação (máx. 4)

Faça de forma leve, uma de cada vez ou em bloco curto:

1. "Em poucas palavras, o que você vende ou entrega?"
2. "Isso é mais um produto digital (curso, software), um serviço que você presta,
   um atendimento (saúde/terapia), um produto físico, ou um negócio com ponto/local?"
3. "Como você cobra: valor único, mensalidade/recorrência, por projeto, ou por sessão?"
4. (se ainda ambíguo) "A entrega é mais online, presencial, ou os dois?"

> PROTOCOLO_DE_AJUDA ativo: se o aliado não souber se enquadrar, ofereça os rótulos
> dos tipos como múltipla escolha ("seria mais tipo curso/mentoria, ou mais tipo
> atendimento individual?") até ele se reconhecer.

### Passo 2 — Pontuar e escolher

- Cruze as respostas com os `signals` de cada tipo em `business-types.yaml`.
- Escolha o tipo de maior aderência.
- Empate real entre dois tipos → híbrido: `business_type` = primário, `secondary_type` = o outro.

### Passo 3 — Confirmar

> "Entendi que seu negócio é **{label do tipo}** — confere? (se não, me corrige)"

Se o aliado corrigir, reclassifique sem discutir.

### Passo 4 — Salvar e transicionar

Atualize `state.yaml`:

```yaml
business_type: "{tipo}"
secondary_type: "{tipo ou null}"
current_phase: 2
phases_done: [..., "detect"]
updated_at: "{data}"
```

Informe ao onboard-chief para carregar os `examples_by_type` desse tipo nas próximas fases.

## Acceptance Criteria

1. No máximo 4 perguntas usadas.
2. `business_type` definido e **confirmado** pelo aliado.
3. `state.yaml` atualizado.

## Outputs

| Output | Descrição |
|--------|-----------|
| `state.yaml → business_type` | Tipo confirmado (+ secondary_type se híbrido) |

---
*Task da squad onboard-aliado — business-detector*
