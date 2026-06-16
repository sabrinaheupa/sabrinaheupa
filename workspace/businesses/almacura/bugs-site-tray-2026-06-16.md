# Bugs do site Almacura (Tray) — chamado consolidado para dev

**Data:** 16/06/2026
**Levantado por:** Midas (squad de tráfego) via auditoria GA4 + inspeção das páginas ao vivo
**Site:** almacura.com.br (plataforma Tray, loja 839348)

Três itens, ordenados por prioridade. O contexto de cada um já está investigado — não precisa re-descobrir o problema, só executar a correção.

---

## 🔴 PRIORIDADE 1 — Encoding quebrado no título/menu de produtos

**Onde:** páginas de produto e itens de menu. Confirmado em pelo menos 2 produtos:
- Óleo Ozonizado de Girassol Spray 60mL (`/produtos-naturais/oleo-de-girassol-ozonizado-60-ml`)
- Creme Dental Natural Hidroxiapatita (`/corpo-e-face/creme-dental-natural-hidroxiapatita-70g`)

**Sintoma:** o caractere "Ó" aparece como "�" (losango/replacement char) **no título da página e em itens do menu de navegação** — mas o corpo da descrição do mesmo produto, com outros acentos (ç, ã, ê, õ), renderiza certo.

**Diagnóstico:** o conteúdo cadastrado no painel está correto (sem corrupção). O problema está na **camada de exibição (template/tema)**, não no dado. Bug de codificação de caracteres específico do componente de título/breadcrumb/menu.

**Por que é prioridade 1:** passa impressão de site quebrado/amador exatamente no título — primeiro elemento que o comprador lê. Afeta percepção de confiança na conversão.

**Ação:** investigar a codificação (charset UTF-8) no template de título de produto e no menu de navegação do tema.

---

## 🟡 PRIORIDADE 2 — Seção de avaliações vazia mostrando "(3 Avaliações)"

**Onde:** página do Creme Dental (e possivelmente outras).

**Sintoma:** o contador mostra "(3 Avaliações)" mas a seção de avaliações vem vazia.

**Hipótese mais provável:** moderação manual ativada — avaliações enviadas ficam "pendentes" e contam no número, mas não aparecem publicamente até serem aprovadas.

**Ação:**
1. Checar **Marketing → Avaliações de Produtos** se há avaliações pendentes de aprovação (se sim, aprovar resolve na hora).
2. Se não houver pendentes, confirmar config em **Configurações → Produto → Geral → Funções Adicionais → "Habilitar Comentários e Avaliações"** e **Configurações → Produto → Abas da Página de Produto** (aba de comentários ativa).
3. Se tudo estiver ativo e ainda vier vazio = bug → chamado suporte Tray.

**Por que é prioridade 2:** prova social quebrada é pior que ausência de prova social — parece bug e reduz confiança.

---

## 🟢 PRIORIDADE 3 (média-baixa) — Evento `add_to_cart` do GA4 dispara inconsistente

**Onde:** tracking GA4 do site (Google Tag Manager).

**Sintoma:** o evento `add_to_cart` do GA4 dispara em ~291 sessões/mês contra 1.294 compras — matematicamente impossível num funil real (não dá pra ter mais compra que carrinho). O botão único "Comprar" leva direto ao carrinho (`redirect_cart_service`), mas o disparo do `add_to_cart` falha especialmente em **páginas de KIT**.

**Diagnóstico:** provável diferença no template de página de kit carregando o script de tracking GA4 de forma diferente do template de produto individual.

**Raio de impacto (importante — por isso é prioridade baixa):**
- ⚠️ Afeta SOMENTE o relatório de funil no GA4 (ficamos cegos na etapa de carrinho).
- ✅ NÃO afeta o pixel da Meta (que dispara AddToCart saudável — verificado).
- ✅ NÃO afeta bidding (campanhas otimizam por purchase, que rastreia bem).
- ✅ NÃO afeta remarketing da Meta (usa pixel Meta, não GA4).
- ✅ NÃO afeta recuperação de carrinho (roda pela Zoppy/Tray).

**Ação:** investigar se o template de página de kit carrega/dispara o `add_to_cart` do dataLayer GA4 de forma diferente do template de produto individual.

---

## Notas para o dev

- Itens 1 e 2 são da plataforma Tray (template/tema + config de avaliações).
- Item 3 é Google Tag Manager (GTM) — login separado.
- **Mais urgente que todos estes** (tracking, mas fora deste documento): a migração do pixel da Meta na Tray, que o Fred está conduzindo — aquela afeta o sinal de conversão das campanhas (super-contagem ~5,6x). Priorizar a do Fred antes destes.
