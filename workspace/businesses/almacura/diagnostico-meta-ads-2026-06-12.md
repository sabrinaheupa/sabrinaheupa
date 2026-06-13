# Diagnóstico Meta Ads — Almacura
**Data:** 12/06/2026  
**Conta:** ALMACURA COMPOSTOS NATURAIS LTDA · act_1364390126268  
**Status:** Diagnóstico completo. Plano de ação definido para segunda-feira 16/06.

---

## Problema Central: Pixel Errado nas Campanhas

### Dois pixels ativos — situações opostas

| Pixel | ID | Criado | Categoria | Restrição |
|-------|----|--------|-----------|-----------|
| Almacura® - Pixel da Meta | 1431333174059694 | ago/2022 | **Nenhuma** ✅ | **Desativada** ✅ |
| Almacura® - 2025 | 1227361809149727 | set/2025 | **Saúde** ⚠️ | **Ativa** ⚠️ |

**Pixel 2022** → limpo, sem restrição, histórico desde 2022, score Purchase 8.9/10  
**Pixel 2025** → categorizado como saúde pelo Meta automaticamente, restrições de targeting ativas, review já solicitada (botão bloqueado — aguardando 30 dias)

### Como o pixel 2025 entrou no site
- Carregado via `facebook-conversion.js` da Tray: `//images.tcdn.com.br/commerce/assets/store/js/dist/facebook-conversion.js?pixel=1227361809149727`
- Origem provável: integração Tray → Meta configurada com pixel 2025 em algum momento de set/2025
- Integração oficial atual (Meta "Aplicativos conectados") mostra pixel 2022 — mas pixel 2025 ainda está carregando no site

### Impacto atual
- Campanhas provavelmente otimizando contra pixel 2025 (restrito)
- Targeting limitado pela classificação de saúde
- Dados de ROAS/CPR inflados pela duplicação (dois pixels + server overcounting no 2025)
- Pixel 2025: server > browser consistentemente (~2x) — overcounting confirmado

---

## Campanhas Ativas — Performance (dados inflados — referência apenas)

| Campanha | Budget/dia | CPR reportado | ROAS reportado |
|----------|-----------|---------------|----------------|
| RMKT Volte [09.03] | R$20 | R$5,62 | 46x |
| Prata Coloidal [29.01] | R$22,50 | R$7,40 | 37x |
| Creme Dental [14/05] | R$45 | R$11,17 | 25x |
| Creme Dental Vídeos [20/05] | R$30 | R$18,15 | 15x |
| Aniversário Itajaí [15/06] | R$20 | R$0 | — |

**Atenção:** números inflados pelo pixel duplicado. Não usar como referência até dados limpos.

---

## Plano de Ação — Segunda-feira 16/06

### ETAPA 1 — Confirmar qual pixel cada campanha usa (ANTES de qualquer mudança)
- [ ] Abrir Gerenciador de Anúncios
- [ ] Entrar em cada campanha ativa → Conjunto de Anúncios → campo "Evento de otimização"
- [ ] Anotar qual pixel aparece em cada campanha
- [ ] **Só avançar para a Etapa 2 após confirmar todas**

### ETAPA 2 — Corrigir a integração Tray (remover pixel 2025 do site)
- [ ] Abrir **aba anônima** no Chrome
- [ ] Acessar painel Tray → integração Facebook/Instagram
- [ ] **Remover** a integração atual
- [ ] **Refazer** a integração, selecionando explicitamente o pixel 2022 (`1431333174059694`) em todas as etapas (Business Manager, Página, Instagram, Catálogo, Conta de Anúncios, **Pixel**)
- [ ] Aguardar 30 minutos
- [ ] Verificar no site **www.almacura.com.br** se pixel 2025 parou:
  ```javascript
  document.documentElement.innerHTML.includes('1227361809149727')
  ```
  - `false` → pixel removido ✅ — avançar para Etapa 3
  - `true` → pixel vem de fora da integração nativa → acionar agência para localizar script manual (tema, GTM, outra app)

### ETAPA 3 — Migrar campanhas para pixel 2022
- [ ] Recriar cada campanha que estava no pixel 2025, agora vinculada ao pixel 2022
- [ ] Manter as campanhas antigas (pixel 2025) rodando em paralelo durante a transição
- [ ] Rodar as duas versões em paralelo por **48-72h** enquanto pixel 2022 aprende
- [ ] Monitorar: se pixel 2022 estabilizar com resultados comparáveis → pausar as do pixel 2025

### ETAPA 4 — Validar dados limpos
- [ ] Após 7 dias só com pixel 2022: comparar dados Meta vs pedidos reais na Tray
- [ ] Recalibrar metas reais de ROAS e CPR
- [ ] Definir novo budget allocation baseado em dados limpos

---

## Outras Melhorias (após dados limpos)

### Realocação de budget
- Aumentar RMKT: R$20 → R$40-50/dia (melhor ROAS da conta)
- Aumentar Prata Coloidal: R$22,50 → R$35-40/dia
- Reduzir/pausar Creme Dental Vídeos (pior performance vs imagens)

### Combater fadiga de criativos
- RMKT: frequência 4,66 — público saturando, novos criativos urgentes
- Expandir público RMKT para janela 60-90 dias
- Novos criativos para campanhas com CTR em queda

### Qualidade do pixel 2022
- Aumentar cobertura de email no AddToCart (atual: 4% → meta: 30%+)
- Aumentar cobertura de telefone no Purchase (atual: 25% → meta: 50%+)

---

## Informações Técnicas de Referência

**Pixel 2022 instalado em:**
- www.almacura.com.br (237.8k eventos/28d)
- easycheckout.tray.com.br (1 evento/28d)

**Integração Tray→Meta:**
- Conexão: "Comércio eletrônico, criada em 25 de ago de 2022"
- Catálogo: Products for Almacuraoficial (110177333693955) — vinculado ao pixel 2022
- Conta de anúncios: ALMACURA COMPOSTOS NATURAIS LTDA

**Suporte Tray (orientação recebida 12/06):**
> "Refazer a integração em aba anônima, selecionando explicitamente o pixel desejado. Se pixel 2025 persistir após refazer, vem de fora da integração nativa (código manual, GTM, outra app) — nesse caso acionar agência parceira."

**Contas identificadas na sessão:**
- Conta principal Almacura: act_1364390126268
- Business: Almacuraoficial (168452711114669)
- Conta USA (sem pagamento): act_1059852369150617
- SH Negócios Digitais (Sabrina): act_710994424224512
