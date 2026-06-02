# Task: Integrar com o Design Starter (OPCIONAL)

```yaml
task:
  id: integrate-design-starter
  name: Criar variant no aiox-design-starter (se presente)
  agent: brand-translator
  elicit: false
  order: 8
  required: false
```

## Descrição

Fase 6b — **opcional e auto-detectada**. SÓ roda se `apps/aiox-design-starter/` existir
no repo. Cria um variant no design-starter a partir do design system portátil já gerado,
para que o aliado tenha uma brandbook page navegável. Se o app não existir, esta task
é **pulada sem erro**.

## Pré-requisitos

- `has_design_starter == true` (detectado no bootstrap).
- `design-system/config.yaml` já gerado (fase 6).

## Workflow

### Passo 0 — Gate de existência (OBRIGATÓRIO)

```bash
if [ ! -d "apps/aiox-design-starter" ]; then
  echo "design-starter ausente — pulando integração (isto é esperado e não é erro)"
  exit 0
fi
```

Se o diretório não existir, informe ao aliado:
> "Seu repo não tem o app de brandbook — sem problema. Seu design system já está pronto
> em arquivos (config.yaml + tokens.css). Se um dia você adicionar o design-starter,
> dá pra gerar a página navegável depois."

E vá direto para o ENCERRAMENTO.

### Passo 1 — Scaffold do variant

```bash
cd apps/aiox-design-starter
node scripts/tenant-cli.cjs scaffold --slug {slug} --name "{business_name}"
```

### Passo 2 — Aplicar a direção visual no variant

Use o `tenant-cli` para setar os campos a partir do `design-system/config.yaml`
(NÃO edite arquivos `.ts` — use o YAML do variant, que é o caminho sem hardcoding):

```bash
# Exemplos (repita por campo necessário)
node scripts/tenant-cli.cjs set --variant {slug} --contract site --path branding.marketing_wordmark --value "{business_name}"
node scripts/tenant-cli.cjs set --variant {slug} --contract site --path branding.brandbook_tagline --value "{design_principle}"
node scripts/tenant-cli.cjs theme --variant {slug} --token primary --value "#{hex_primary}"
node scripts/tenant-cli.cjs theme --variant {slug} --token background --value "#{hex_background}"
# ... demais tokens de cor
```

> Mapeie os tokens de `design-system/config.yaml` para os tokens do tema do starter.
> Confira os nomes de token aceitos com: `node scripts/tenant-cli.cjs get --contract design-system --path . --variant {slug}` ou o help do CLI.

### Passo 3 — Validar e prever

```bash
node scripts/tenant-cli.cjs validate
node scripts/tenant-cli.cjs diff --variant {slug}
```

Mostre o diff ao aliado. Para visualizar: `node scripts/tenant-cli.cjs preview --variant {slug}`.

### Passo 4 — Encerrar

Informe que o variant foi criado e como dar deploy (a critério do ambiente do aliado).
Vá para o ENCERRAMENTO do onboard-chief.

## Observação importante sobre HARDCODING

> O design system portátil (`workspace/businesses/{slug}/design-system/`) é a **fonte de
> verdade** e nunca depende deste app. Esta integração usa apenas os **contratos YAML**
> do variant (`tenant-cli`), nunca os arquivos `*-brand-data.ts`. Assim a brandbook page
> reflete os dados do aliado sem cair no hardcoding dos seeds `.ts`.
>
> Se a brandbook page do starter ainda renderizar dados fixos (bug conhecido de seeds
> `.ts` hardcoded no app), isso é uma correção a ser feita NO APP (gerar brand-data a
> partir do `site.config.yaml`), fora do escopo desta squad portátil.

## Acceptance Criteria

1. Se o app não existe → task pulada sem erro e aliado informado.
2. Se existe → variant criado, tokens aplicados via YAML (não `.ts`), `validate` passou.

## Outputs

| Output | Descrição |
|--------|-----------|
| `apps/aiox-design-starter/starter/variants/{slug}/` | Variant do aliado (quando o app existe) |

---
*Task da squad onboard-aliado — brand-translator*
