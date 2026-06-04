import { spawn } from "node:child_process";
import { SUBAGENTS, SCHEMA_INSTRUCTION } from "./audit-prompts";
import { scanMultipleCompetitors } from "./competitor-scanner";
import type { AuditResult, SubagentResult, CompetitorAnalysis, CompetitorData } from "./types";

const CLAUDE_BIN = process.env.CLAUDE_BIN || "claude";
const MODEL = process.env.CLAUDE_MODEL || "sonnet";

function gradeFromScore(score: number): AuditResult["grade"] {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

async function fetchSiteContent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; AuditBot/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Site retornou ${response.status}`);
  const html = await response.text();
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 18000);
}

function extractJSON(text: string): unknown {
  const cleaned = text.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON não encontrado na resposta");
    return JSON.parse(match[0]);
  }
}

function callClaudeCLI(prompt: string, timeoutMs = 180000): Promise<string> {
  return new Promise((resolve, reject) => {
    const cleanEnv: NodeJS.ProcessEnv = { ...process.env };
    delete cleanEnv.ANTHROPIC_API_KEY;
    delete cleanEnv.ANTHROPIC_AUTH_TOKEN;
    delete cleanEnv.ANTHROPIC_BASE_URL;

    const proc = spawn(
      CLAUDE_BIN,
      [
        "-p",
        "--output-format",
        "json",
        "--disable-slash-commands",
        "--no-session-persistence",
        "--model",
        MODEL,
      ],
      { env: cleanEnv },
    );

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error(`Timeout após ${timeoutMs}ms`));
    }, timeoutMs);

    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        return reject(new Error(stderr.trim() || `claude exited ${code}`));
      }
      try {
        const parsed = JSON.parse(stdout) as {
          is_error?: boolean;
          result?: string;
          subtype?: string;
        };
        if (parsed.is_error) {
          return reject(new Error(parsed.result || "Claude CLI retornou erro"));
        }
        if (!parsed.result) {
          return reject(new Error("Resposta vazia do Claude CLI"));
        }
        resolve(parsed.result);
      } catch (err) {
        reject(new Error(`Falha ao parsear JSON do CLI: ${(err as Error).message}`));
      }
    });

    proc.stdin.on("error", () => {});
    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}

async function runSubagent(
  agent: (typeof SUBAGENTS)[number],
  url: string,
  content: string,
): Promise<SubagentResult> {
  const prompt = `${agent.prompt}\n\nURL analisada: ${url}\n\nConteúdo do site (extraído):\n\n${content}\n\n${SCHEMA_INSTRUCTION}`;
  const text = await callClaudeCLI(prompt);
  const parsed = extractJSON(text) as Omit<SubagentResult, "id" | "label" | "weight">;
  return { id: agent.id, label: agent.label, weight: agent.weight, ...parsed };
}

async function synthesize(
  url: string,
  results: SubagentResult[],
): Promise<{ executiveSummary: string; quickWins: string[]; mediumTerm: string[]; strategic: string[] }> {
  const overall =
    results.reduce((sum, r) => sum + r.score * r.weight, 0) /
    results.reduce((sum, r) => sum + r.weight, 0);

  const summary = results
    .map(
      (r) =>
        `[${r.label}: ${r.score}/100] ${r.summary}\nFixes: ${r.fixes
          .map((f) => `(${f.severity}) ${f.title}`)
          .join("; ")}`,
    )
    .join("\n\n");

  const prompt = `Você é estrategista sênior de marketing. Sintetize esta auditoria do site ${url} (score geral: ${overall.toFixed(0)}/100) em um plano executivo.

Resultados dos 5 analistas:

${summary}

Retorne APENAS JSON válido (sem markdown, sem explicação extra):
{
  "executiveSummary": "<3-4 parágrafos para apresentar em reunião com o dono do negócio. Lidere com o score, destaque a maior força, a maior lacuna, e as top 3 ações que mais movem o ponteiro. Tom: consultor experiente, direto, sem rodeios. Português do Brasil>",
  "quickWins": ["<5-7 ações para implementar nesta semana, específicas>"],
  "mediumTerm": ["<3-5 iniciativas para 1-3 meses>"],
  "strategic": ["<2-4 transformações de 3-6 meses>"]
}`;

  const text = await callClaudeCLI(prompt);
  return extractJSON(text) as {
    executiveSummary: string;
    quickWins: string[];
    mediumTerm: string[];
    strategic: string[];
  };
}

async function identifyCompetitors(url: string, content: string): Promise<string[]> {
  const prompt = `Analise o conteúdo do site abaixo e identifique 3 concorrentes diretos prováveis (mesmo nicho/serviço/público).

URL: ${url}

Conteúdo:
${content.slice(0, 6000)}

Retorne APENAS JSON válido (sem markdown):
{
  "competitors": ["dominio1.com.br", "dominio2.com", "dominio3.com"]
}

Regras:
- Apenas domínios reais e conhecidos (não invente nomes)
- Mesmo nicho que o site analisado
- Preferir concorrentes brasileiros se o site for brasileiro
- Apenas o domínio puro (sem https, sem www, sem caminho)`;

  try {
    const text = await callClaudeCLI(prompt, 60000);
    const parsed = extractJSON(text) as { competitors: string[] };
    return (parsed.competitors || []).slice(0, 3).filter((d) => /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(d));
  } catch {
    return [];
  }
}

async function synthesizeCompetitorAnalysis(
  targetDomain: string,
  targetHeadline: string,
  scanned: CompetitorData[],
): Promise<CompetitorAnalysis["comparison"] & { recommendations: string[] }> {
  const competitorSummary = scanned
    .filter((c) => !c.error)
    .map(
      (c) =>
        `[${c.domain}]
Headline: ${c.headline || "(sem H1)"}
Tagline: ${c.tagline || "(sem meta description)"}
Pricing visível: ${c.pricingMentions.slice(0, 3).join(", ") || "não visível"}
CTAs: ${c.ctas.slice(0, 4).join(" | ") || "não detectados"}
Social: ${c.socialPlatforms.join(", ") || "nenhuma"}
Depoimentos: ${c.hasTestimonials ? "sim" : "não"}
Word count: ${c.wordCount}`,
    )
    .join("\n\n");

  const prompt = `Você é estrategista competitivo sênior. Compare o site analisado com 3 concorrentes reais cujos dados foram extraídos.

Site analisado:
- Domínio: ${targetDomain}
- Headline: ${targetHeadline || "(sem headline)"}

Concorrentes analisados:

${competitorSummary}

Retorne APENAS JSON válido (sem markdown):
{
  "headline": "<1 frase comparando a clareza dos headlines dos concorrentes vs o site analisado>",
  "pricing": "<1 frase comparando se concorrentes mostram preço e qual estratégia (vs o site analisado que não mostra)>",
  "differentiation": "<1 frase sobre como cada concorrente se posiciona e qual território o site analisado ocupa ou deveria ocupar>",
  "biggestThreat": "<qual concorrente é a maior ameaça e por quê, em 1 frase específica>",
  "biggestOpportunity": "<qual gap competitivo o site analisado deveria atacar, em 1 frase acionável>",
  "recommendations": ["<3-5 ações específicas baseadas no que os concorrentes fazem melhor>"]
}`;

  const text = await callClaudeCLI(prompt, 90000);
  return extractJSON(text) as CompetitorAnalysis["comparison"] & { recommendations: string[] };
}

async function runCompetitorAnalysis(
  url: string,
  domain: string,
  content: string,
): Promise<CompetitorAnalysis | null> {
  try {
    const domains = await identifyCompetitors(url, content);
    if (domains.length === 0) return null;
    const scanned = await scanMultipleCompetitors(domains);

    const targetHeadline = (content.match(/[\w\s,!?.-]{20,100}/)?.[0] || "").trim();
    const synthesis = await synthesizeCompetitorAnalysis(domain, targetHeadline, scanned);

    return {
      competitors: scanned,
      comparison: {
        headline: synthesis.headline,
        pricing: synthesis.pricing,
        differentiation: synthesis.differentiation,
        biggestThreat: synthesis.biggestThreat,
        biggestOpportunity: synthesis.biggestOpportunity,
      },
      recommendations: synthesis.recommendations,
    };
  } catch (e) {
    console.error("[competitor-analysis] failed:", (e as Error).message);
    return null;
  }
}

export async function runAudit(url: string): Promise<AuditResult> {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname.replace(/^www\./, "");
  const content = await fetchSiteContent(url);

  const [subagents, competitorAnalysis] = await Promise.all([
    Promise.all(SUBAGENTS.map((agent) => runSubagent(agent, url, content))),
    runCompetitorAnalysis(url, domain, content),
  ]);

  const overallScore = Math.round(
    subagents.reduce((sum, r) => sum + r.score * r.weight, 0) /
      subagents.reduce((sum, r) => sum + r.weight, 0),
  );

  const synthesis = await synthesize(url, subagents);

  return {
    url,
    domain,
    date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
    overallScore,
    grade: gradeFromScore(overallScore),
    executiveSummary: synthesis.executiveSummary,
    subagents,
    competitorAnalysis,
    quickWins: synthesis.quickWins,
    mediumTerm: synthesis.mediumTerm,
    strategic: synthesis.strategic,
  };
}
