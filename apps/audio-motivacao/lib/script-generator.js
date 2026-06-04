"use strict";

/**
 * Gerador do MIOLO do roteiro (blocos 4–6: visualização + sugestões + mantra)
 * no estilo do Michael, via Claude (Anthropic). Os blocos fixos vêm de fixed-blocks.js.
 *
 * Retorna o roteiro completo já segmentado por tom:
 *   [{ tom, texto, fixed }]
 */

const https = require("https");
const os = require("os");
const { spawn } = require("child_process");
const { INTRO, APROFUNDAMENTO, PONTE, EMERSAO, FECHAMENTO } = require("./fixed-blocks");

// Provider chain (em ordem). Cada um é tentado; se falhar (sem saldo/erro), cai para o próximo.
// Override: HIPNOSE_PROVIDER = openrouter | gemini | anthropic
const MODEL = process.env.HIPNOSE_MODEL || "auto";

// Alvo de palavras do miolo por duração (fixos somam ~300 palavras / ~2 min)
const DURACAO = {
  curta:    { palavras: 230,  rotulo: "curta (~3 min)" },
  media:    { palavras: 620,  rotulo: "média (~6 min)" },
  completa: { palavras: 1150, rotulo: "completa (~10 min)" },
};

const SYSTEM = `Você é um hipnoterapeuta da OMNI escrevendo o MIOLO de uma omniterapia coletiva motivacional em português do Brasil. Você recebe um TEMA e escreve apenas os blocos centrais (visualização + sugestões + mantra) — a indução, o aprofundamento e a emersão já existem e NÃO devem ser escritos por você.

ESTILO OBRIGATÓRIO (assinatura OMNI):
- 2ª pessoa do singular ("você"), tempo presente, sempre afirmativo. Nunca use frases no negativo.
- Marcadores frequentes: "Muito bem", "Ótimo".
- Loops recursivos: "quanto mais X, mais Y".
- Empilhamento: "sentindo ótimo, sentindo incrível, sentindo extraordinário".
- Frases curtas, ritmadas, hipnóticas. Repetição para ênfase.
- Audiência GENÉRICA: nada de jargão interno de vendas/time/ligações/nomes próprios, a menos que o tema peça.

ESTRUTURA DO MIOLO:
1. VISUALIZAÇÃO (tom: hipnose): comece SEMPRE com "Eu quero que você imagine agora que você está numa sala..." e construa uma sala/cenário coerente com o tema, que sirva de metáfora viva para a mensagem.
2. SUGESTÕES (tom: motivacional): o ensino central no tema — sugestões diretas, convicção, impacto (sem gritar).
3. MANTRA (tom: motivacional): termine com uma afirmação curta em 1ª pessoa que a pessoa repete na mente, ligada ao tema (ex.: "Eu sou muito abundante"). Peça para repetir algumas vezes.

SAÍDA: responda APENAS um JSON válido (sem markdown, sem comentários), um array de segmentos:
[
  { "tom": "hipnose", "texto": "..." },
  { "tom": "motivacional", "texto": "..." }
]
Agrupe frases do mesmo tom num único segmento (não fragmente demais). Use só os tons "hipnose" e "motivacional" no miolo.`;

function httpsPostJSON(hostname, path, headers, bodyObj) {
  const body = Buffer.from(JSON.stringify(bodyObj));
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "POST", headers: { ...headers, "Content-Length": body.length } },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Providers de LLM (retornam o texto bruto da resposta) ──────────────────────

// Preferido: usa o CLI do Claude (assinatura já autenticada na máquina) — NÃO gasta créditos de API.
// Roda a partir de /tmp para não carregar o CLAUDE.md do projeto.
function viaClaudeCLI(system, user) {
  const model = process.env.HIPNOSE_CLI_MODEL || "sonnet";
  const args = [
    "-p", user,
    "--system-prompt", system,
    "--model", model,
    "--output-format", "text",
    "--exclude-dynamic-system-prompt-sections",
  ];
  // Remove ANTHROPIC_API_KEY do ambiente do filho: assim o CLI usa o login por ASSINATURA (OAuth),
  // não a chave de API (que está sem saldo). É isso que evita gastar créditos.
  const childEnv = { ...process.env };
  delete childEnv.ANTHROPIC_API_KEY;
  delete childEnv.ANTHROPIC_AUTH_TOKEN;

  return new Promise((resolve, reject) => {
    // stdin ignorado (evita o aviso "no stdin data"); cwd em /tmp p/ não carregar CLAUDE.md do projeto.
    const child = spawn("claude", args, { cwd: os.tmpdir(), env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
    let out = "", errb = "";
    const timeoutMs = parseInt(process.env.HIPNOSE_CLI_TIMEOUT_MS || "75000", 10);
    const killer = setTimeout(() => child.kill("SIGKILL"), timeoutMs);
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (errb += d));
    child.on("error", (e) => { clearTimeout(killer); reject(new Error(`claude CLI: ${e.message}`)); });
    child.on("close", (code) => {
      clearTimeout(killer);
      const t = out.trim();
      if (t) return resolve(t);
      reject(new Error(`claude CLI (code ${code}): ${errb.slice(0, 200) || "vazio"}`));
    });
  });
}

async function viaOpenRouter(system, user) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("sem OPENROUTER_API_KEY");
  const model = process.env.HIPNOSE_OPENROUTER_MODEL || "anthropic/claude-sonnet-4";
  const res = await httpsPostJSON("openrouter.ai", "/api/v1/chat/completions",
    { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    { model, temperature: 0.8, messages: [{ role: "system", content: system }, { role: "user", content: user }] });
  if (res.status !== 200) throw new Error(`OpenRouter ${res.status}: ${res.body.slice(0, 200)}`);
  const j = JSON.parse(res.body);
  return j.choices?.[0]?.message?.content || "";
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function viaGemini(system, user) {
  const key = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("sem GOOGLE_AI_STUDIO_API_KEY");
  const models = process.env.HIPNOSE_GEMINI_MODEL
    ? [process.env.HIPNOSE_GEMINI_MODEL]
    : ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];
  let last = "";
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await httpsPostJSON("generativelanguage.googleapis.com",
        `/v1beta/models/${model}:generateContent?key=${key}`,
        { "Content-Type": "application/json" },
        { systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { temperature: 0.8 } });
      if (res.status === 200) {
        const j = JSON.parse(res.body);
        const out = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
        if (out.trim()) return out;
      }
      last = `${model} ${res.status}: ${res.body.slice(0, 120)}`;
      if (res.status === 503 || res.status === 429) { await sleep(1500); continue; }
      break; // outros erros: pula pro próximo modelo
    }
  }
  throw new Error(`Gemini falhou — ${last}`);
}

async function viaAnthropic(system, user) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("sem ANTHROPIC_API_KEY");
  const model = process.env.HIPNOSE_ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const res = await httpsPostJSON("api.anthropic.com", "/v1/messages",
    { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    { model, max_tokens: 4096, system, messages: [{ role: "user", content: user }] });
  if (res.status !== 200) throw new Error(`Anthropic ${res.status}: ${res.body.slice(0, 200)}`);
  const j = JSON.parse(res.body);
  return (j.content || []).map((b) => b.text || "").join("");
}

const PROVIDERS = { cli: viaClaudeCLI, openrouter: viaOpenRouter, gemini: viaGemini, anthropic: viaAnthropic };

async function chamarLLM(system, user) {
  const forced = process.env.HIPNOSE_PROVIDER;
  const ordem = forced ? [forced] : ["cli", "gemini", "openrouter", "anthropic"];
  const erros = [];
  for (const nome of ordem) {
    const fn = PROVIDERS[nome];
    if (!fn) continue;
    try {
      const out = await fn(system, user);
      if (out && out.trim()) return { texto: out, provider: nome };
    } catch (e) { erros.push(`${nome}: ${e.message}`); }
  }
  throw new Error(`Todos os providers falharam — ${erros.join(" | ")}`);
}

async function gerarMiolo(tema, duracao) {
  const cfg = DURACAO[duracao] || DURACAO.media;
  const userMsg =
    `TEMA: ${tema}\n\n` +
    `Escreva o miolo com aproximadamente ${cfg.palavras} palavras no total ` +
    `(versão ${cfg.rotulo}). Lembre: comece a visualização com "Eu quero que você imagine agora que você está numa sala...". ` +
    `Responda só o JSON.`;

  const { texto, provider } = await chamarLLM(SYSTEM, userMsg);
  if (process.env.NODE_ENV !== "production") console.log(`[script-generator] provider=${provider}`);
  const match = texto.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`LLM não retornou JSON válido:\n${texto.slice(0, 400)}`);

  const segs = JSON.parse(match[0]);
  if (!Array.isArray(segs) || segs.length === 0) throw new Error("Miolo vazio");
  // sanitiza tons
  return segs
    .filter((s) => s && s.texto && s.texto.trim())
    .map((s) => ({
      tom: ["hipnose", "motivacional", "normal"].includes(s.tom) ? s.tom : "hipnose",
      texto: s.texto.trim(),
    }));
}

/**
 * Monta o roteiro completo (fixos + miolo) já segmentado por tom.
 * @returns {Promise<Array<{tom,texto,fixed}>>}
 */
async function gerarRoteiro(tema, duracao) {
  const miolo = await gerarMiolo(tema, duracao);
  const fixo = (b) => ({ ...b, fixed: true });
  const dyn = (s) => ({ ...s, fixed: false });
  // Termina na EMERSAO (parte motivacional "...sentindo ótimo, incrível, extraordinário").
  // Sem FECHAMENTO ("salva de palmas") — decisão do Michael.
  return [
    fixo(INTRO),
    fixo(APROFUNDAMENTO),
    fixo(PONTE),
    ...miolo.map(dyn),
    fixo(EMERSAO),
  ];
}

module.exports = { gerarRoteiro, gerarMiolo, DURACAO, MODEL };
