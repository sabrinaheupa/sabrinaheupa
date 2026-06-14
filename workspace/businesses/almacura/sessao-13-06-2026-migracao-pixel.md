# Sessão 13/06/2026 — Migração Pixel 2025 → 2022

## STATUS GERAL: 🟡 EM ANDAMENTO

**Objetivo:** Migrar todos os ad sets do pixel 2025 (`1227361809149727` — restrito saúde) para o pixel 2022 (`1431333174059694` — limpo), rodando em paralelo por ~7 dias até Fred ajustar a Tray.

---

## Ad sets P2022 — STATUS FINAL DA SESSÃO

### ✅ ATIVOS (criados via MCP/API)

| Ad Set P2022 | ID | Campanha | Ads | Pixel |
|---|---|---|---|---|
| [PB ADV+] P2022 | 52546613933593 | Creme Dental [14/05] | 2 | 1431333174059694 ✅ |
| [PB-MIX-QUENTES] P2022 | 52546614034593 | Creme Dental [14/05] | 4 | 1431333174059694 ✅ |
| [MIX QUENTES] Prata Coloidal P2022 | 52546614729593 | Prata Coloidal [29.01] | 5 | 1431333174059694 ✅ |
| [PB-MIX-QUENTES] Cópia P2022 | 52546621205193 | Creme Dental Vídeos [20/05] | 2* | 1431333174059694 ✅ |
| [PB-Semelhante (2%)] P2022 | 52546666916793 | Creme Dental Vídeos [20/05] | 1* | 1431333174059694 ✅ |
| [RMKT] - VIDEO- FB/IG — P2022 | (via API, buscar no Gerenciador) | (RMKT) | 0* | 1431333174059694 ✅ |

> *Faltam anúncios de catálogo — adicionar manualmente no Gerenciador (ver pendências abaixo)

### ⚠️ PAUSED / SHELLS VAZIOS (deletar quando concluído)

| Ad Set | ID | Motivo |
|---|---|---|
| [SA] ANIVERSÁRIO DE ITAJAI - 15/06 — P2022 | 52546674100193 | Shell vazio — substituir pela Cópia do Gerenciador |
| [PB-Semelhante (1%)] P2022 | 52546666834793 | Shell vazio — substituir por duplicata do Gerenciador |

### 🔴 EM RASCUNHO (travado no Gerenciador)

| Ad Set | Problema | Solução |
|---|---|---|
| [SA] ANIVERSÁRIO DE ITAJAI - 15/06 — Cópia | Erro de localização deprecado (#1870194) | Ver instruções abaixo |

---

## Pendências — O que fazer ao retomar

### 🔴 PRIORIDADE 1: Aniversário [SA] 15/06 — evento começa 15/06

O rascunho **[SA] ANIVERSÁRIO DE ITAJAI - 15/06 — Cópia** foi criado no Gerenciador com pixel 2022 correto, mas falhou ao publicar por erro de localização deprecada (`location_types` removido pela Meta).

**Solução A (tente primeiro):**
1. Gerenciador → campanha Aniversário → abrir o rascunho Cópia → **Editar**
2. Em **Localizações**: remover "Brasil" e re-adicionar "Brasil" do zero
3. Publicar

**Solução B (se A falhar):**
1. Descartar o rascunho Cópia (`Descartar rascunhos`)
2. Duplicar novamente o ad set original `52545497501593`
3. Trocar "Conjunto de dados" para **Almacura® - Pixel da Meta (1431333174059694)**
4. Em Localizações: remover e re-adicionar "Brasil"
5. Publicar

**Solução C (se Gerenciador continuar em loop):**
- Avisar para criar o ad set via MCP (API) — consigo criar o ad set mas os 4 anúncios de catálogo precisarão ser adicionados manualmente no Gerenciador depois

---

### 🟡 PRIORIDADE 2: Semelhante 1% — duplicar no Gerenciador

Ad set original: `52516473892193` — [PB-Semelhante (1%)] COMPRADORES-ULTIMOS-3...

1. Gerenciador → Duplicar ad set original
2. Trocar pixel para **Almacura® - Pixel da Meta**
3. Publicar (aceitar erro de localização ou re-adicionar Brasil primeiro)
4. Depois: deletar o shell vazio `52546666834793`

---

### 🟡 PRIORIDADE 3: Anúncios de catálogo faltando (não bloqueante)

Os ad sets abaixo estão ativos mas com anúncios faltando porque criativos de catálogo são bloqueados pela API (erro 3858040). Adicionar manualmente no Gerenciador:

| Ad Set | ID | Ads faltando |
|---|---|---|
| [PB-MIX-QUENTES] Cópia P2022 | 52546621205193 | AD-09KIT, AD-10KIT, AD-11ENX, AD-12ENX (4 ads de catálogo) |
| [PB-Semelhante (2%)] P2022 | 52546666916793 | 2 criativos de catálogo do original |

**Como adicionar:** Gerenciador → ad set P2022 → + Criar anúncio → copiar criativo do original

---

### 🟡 PRIORIDADE 4: RMKT — audiências faltando

O [RMKT] - VIDEO- FB/IG — P2022 foi criado com targeting correto mas sem:
- IG - [SEGUIDORES] (audiência de engajamento — ID não disponível via API)
- FB - [ENGAJAMENTO] - 365D (audiência de engajamento — ID não disponível via API)

**Como adicionar:** Gerenciador → ad set RMKT P2022 → Editar → Públicos → adicionar as 2 audiências acima

---

## O que o FRED faz (em 5-7 dias a partir de 13/06)

1. Desativar integração Facebook/Instagram na **Tray** (pixel 2025)
2. Refazer a integração em aba anônima selecionando **pixel 2022** (`1431333174059694`)
3. Verificar remoção: `document.documentElement.innerHTML.includes('1227361809149727')` → deve retornar **false**

---

## Timeline

| Quando | O que fazer |
|---|---|
| Ao retomar (hoje/amanhã) | Publicar Aniversário Cópia, duplicar Semelhante 1% |
| ~15/06 | Verificar se Aniversário está rodando com pixel 2022 |
| ~18-20/06 | Fred conclui Tray · Verificar se P2022 saíram do aprendizado |
| ~20/06 | Se P2022 convertendo → pausar todos os originais (pixel 2025) |
| ~27/06 | Comparar dados Meta vs pedidos Tray para recalibrar ROAS/CPR |

---

---

## AUDITORIA COMPLETA — realizada automaticamente em 13/06 (pós-saída de Sabrina)

### ✅ Ad sets P2022 — verificação anúncio por anúncio

| Ad Set P2022 | ID | Ads confirmados | Status entrega |
|---|---|---|---|
| [PB ADV+] P2022 | 52546613933593 | AD-04-IU ✅ · AD-05-IU ✅ = **2 ads** | Em aprendizado |
| [PB-MIX-QUENTES] P2022 | 52546614034593 | AD-04 ✅ · AD-05 ✅ · AD-06 ✅ · AD-07 ✅ = **4 ads** | Em aprendizado |
| [MIX QUENTES] Prata Coloidal P2022 | 52546614729593 | VIDEO1 ✅ · VIDEO2 ✅ · VIDEO3 ✅ · IMG1 ✅ · IMG2 ✅ = **5 ads** | Em aprendizado |
| [PB-MIX-QUENTES] Cópia P2022 | 52546621205193 | VIDEO-QUENTE-01 ✅ · VIDEO-QUENTE-02 ✅ = **2 ads** (faltam 4 catálogo) | Em aprendizado |
| [PB-Semelhante (2%)] P2022 | 52546666916793 | AD-01-VIDEO-SEM2% ✅ = **1 ad** (faltam 2 catálogo) | Em aprendizado |
| [RMKT] - VIDEO- FB/IG — P2022 | 52546672271993 | AD1_RMKT_IMAGEM ✅ = **1 ad** | Em aprendizado |
| [MIX QUENTES] VIDEO FB/IG — P2022 ⚠️ NOVO | 52546713778993 | VIDEO1 ✅ · VIDEO2 ✅ · VIDEO3 ✅ · IMG1 ✅ · IMG2 ✅ = **5 ads** | Em aprendizado |

> **Total: 7 ad sets P2022 ATIVOS · 20 anúncios confirmados ativos**

---

### ✅ Ad sets originais (pixel 2025) — todos ainda ativos

| Ad Set original | ID | Status | Observação |
|---|---|---|---|
| [PB ADV+] [M-H] [21-55] IG-FB] | 52508435408993 | ACTIVE | ⚠️ `learning_exit_unsuccessfully` — ver nota abaixo |
| [PB-MIX-QUENTES] [M-H] [25-65] IG-FB] | 52508497559193 | ACTIVE | Entregando normalmente |
| [PB-MIX-QUENTES] Cópia | 52516501632793 | ACTIVE | Em aprendizado |
| [PB-Semelhante (1%)] | 52516473892193 | ACTIVE | Em aprendizado |
| [PB-Semelhante (2%)] | 52516504768593 | ACTIVE | Em aprendizado |
| [RMKT] - VIDEO- FB/IG | 6962526690389 | ACTIVE | Em aprendizado |
| [MIX QUENTES] - VIDEO- FB/IG | 6939751136789 | ACTIVE | Em aprendizado |

---

### 🔴 ALERTA 1 — [PB ADV+] original com `learning_exit_unsuccessfully`

O ad set original `52508435408993` saiu da fase de aprendizado **sem sucesso** (não conseguiu otimizar). Isso significa que o pixel 2025 restrito está atrapalhando a performance desse ad set especificamente. O P2022 equivalente está em aprendizado normal — boa indicação que vai performar melhor.

**Ação:** Monitorar. Quando o P2022 sair do aprendizado com bons resultados (~18-20/06), pausar o original imediatamente (não esperar os 7 dias se o original já falhou).

---

### 🔴 CAMPANHAS DO ALEX — AUDITORIA COMPLETA (verificação em tempo real, 13/06)

Alex criou **3 campanhas** (não todas as 5 como ele disse). Todas estão **PAUSED** agora.

#### Campanha 1 — Prata Coloidal
**ID:** `52546713779393` — **PAUSED** (status mudou durante a sessão — possivelmente Alex pausou)
**Ad sets:**
- `52546713778993` — `[MIX QUENTES] - VIDEO- FB/IG — P2022` — ACTIVE (5 ads) — duplica nosso `52546614729593`
- `52546713781393` — `[MIX QUENTES] - VIDEO- FB/IG` (sem sufixo P2022) — ACTIVE (5 ads)

#### Campanha 2 — RMKT
**ID:** `52546731580993` — **PAUSED** (pausada por mim via API durante a sessão)
- Tinha 2 ad sets (descobertos depois — a query inicial com EQUAL retornou 0, erro de operador)

#### Campanha 3 — Creme Dental Vendas ⚠️ NOVA DESCOBERTA
**ID:** `52546741727993` — **PAUSED**, R$45/dia, `date_stop: 13/06`
**Ad sets (confirmados ao vivo):**
- `52546741728793` — `[PB-MIX-QUENTES] [M-H] [25-65] IG-FB]` — ACTIVE (CAMPAIGN_PAUSED) — duplica ad set do Creme Dental [14/05]
- `52546741728993` — `[PB ADV+] [M-H] [21-55] IG-FB]` — ACTIVE (CAMPAIGN_PAUSED) — duplica ad set do Creme Dental [14/05]
> ⚠️ `date_stop = 13/06` — Alex colocou data de fim para hoje. Campanha já teria parado sozinha mesmo sem intervenção.

**Alex NÃO duplicou:**
- [SA] ANIVERSÁRIO DE ITAJAI - 15/06
- [AB] VENDAS-VIDEOS CREME-DENTAL [20/05]

**Status consolidado das campanhas do Alex:**

| Campanha Alex | ID | Status | Quem pausou |
|---|---|---|---|
| Prata Coloidal [13.06] | 52546713779393 | PAUSED | Alex (mudança detectada em tempo real) |
| RMKT [13.06] | 52546731580993 | PAUSED | EU (via API durante sessão) |
| Creme Dental [13.06] | 52546741727993 | PAUSED | Alex (criada paused + date_stop hoje) |

**Decisão pendente com Sabrina:** deletar as 3 campanhas do Alex? Posso pausar via API se ainda não estiverem pausadas. Deletar requer confirmação dela.

---

### ✅ Pixels — verificação de sinais ativos

| Pixel | ID | Status | Volume (7 dias) |
|---|---|---|---|
| Pixel 2022 (limpo) | 1431333174059694 | ✅ Recebendo eventos | Moderado — via GTM |
| Pixel 2025 (restrito) | 1227361809149727 | ⚠️ Ainda dominante | Alto — via Tray JS |

**Conclusão:** Os dois pixels estão disparando simultaneamente, como esperado. Pixel 2025 ainda tem volume maior porque a Tray JS carrega em toda página. Após Fred corrigir a Tray, pixel 2025 deve zerar e pixel 2022 assumir todo o volume.

---

### ✅ Shells vazios — confirmados

| Shell | ID | Confirmação |
|---|---|---|
| [SA] ANIVERSÁRIO P2022 | 52546674100193 | PAUSED, 0 ads ✅ |
| [PB-Semelhante (1%)] P2022 | 52546666834793 | PAUSED, 0 ads ✅ |

Deletar após concluir as duplicações do Gerenciador.

---

## Limitações técnicas descobertas na sessão

1. **Criativos de catálogo bloqueados via API** — erro 100/3858040 · Afeta: KIT, ENX, Aniversário, Semelhante 1%
2. **Rascunhos do Gerenciador não acessíveis via MCP** — API não retorna entidades em status DRAFT
3. **location_types deprecado pela Meta** — erro #1870194 · Fix: remover/re-adicionar localização no Gerenciador
4. **Advantage+ adiciona targeting_as_signal automático** — resolvido via API com `targeting_automation: {advantage_audience: 0}`
5. **Pixel de ad set publicado não pode ser editado** — erro 100/3260011 · Por isso duplicamos

---

## Dados de referência

**Contas:**
- Conta: act_1364390126268
- Business: Almacuraoficial (168452711114669)

**Pixels:**
- Pixel 2022 (limpo, usar este): `1431333174059694`
- Pixel 2025 (restrito saúde, desativar): `1227361809149727`

**Ad set original Aniversário:** `52545497501593` — campanha `52545497501393`
**Catálogo:** Products for Almacuraoficial — ID: `110177333693955`

**Time:**
- Fred (desenvolvedor) — responsável pela Tray e GTM
- Alex (gestor de tráfego) — pode executar pendências do Gerenciador
- GTM: GTM-KKRZZZGL
