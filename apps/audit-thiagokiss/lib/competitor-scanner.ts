import type { CompetitorData } from "./types";

const SOCIAL_DOMAINS: Record<string, string> = {
  "twitter.com": "Twitter/X",
  "x.com": "Twitter/X",
  "facebook.com": "Facebook",
  "linkedin.com": "LinkedIn",
  "instagram.com": "Instagram",
  "youtube.com": "YouTube",
  "tiktok.com": "TikTok",
  "github.com": "GitHub",
};

const CTA_WORDS = [
  "sign up",
  "get started",
  "try free",
  "buy",
  "subscribe",
  "join",
  "register",
  "download",
  "book",
  "demo",
  "contact",
  "pricing",
  "começar",
  "agendar",
  "contratar",
  "fale conosco",
  "saiba mais",
  "cadastre-se",
];

const PRICING_PATTERNS = [
  /\$\s?\d+/i,
  /€\s?\d+/i,
  /£\s?\d+/i,
  /R\$\s?\d+/i,
  /\b\d+\/(month|year|mo)\b/i,
  /per\s+(month|year)/i,
  /annually/i,
  /free\s+(plan|tier|trial)/i,
  /enterprise/i,
  /plano\s+gratuito/i,
  /mensal/i,
  /anual/i,
];

const TESTIMONIAL_WORDS = [
  "testimonial",
  "review",
  "case study",
  "success story",
  "depoimento",
  "case de sucesso",
  "o que dizem",
];

function extractMetaContent(html: string, name: string): string {
  const patterns = [
    new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i"),
    new RegExp(`<meta[^>]*property=["']og:${name}["'][^>]*content=["']([^"']*)["']`, "i"),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match) return match[1].trim();
  }
  return "";
}

function extractTagText(html: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text) out.push(text);
  }
  return out;
}

function extractCTAs(html: string): string[] {
  const buttons = extractTagText(html, "button");
  const linkMatches = html.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi);
  const links: string[] = [];
  for (const m of linkMatches) {
    const text = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text && text.length < 50) links.push(text);
  }
  const all = [...buttons, ...links];
  const ctas = all.filter((t) => CTA_WORDS.some((w) => t.toLowerCase().includes(w)));
  return Array.from(new Set(ctas)).slice(0, 8);
}

function extractSocial(html: string): string[] {
  const found = new Set<string>();
  for (const [domain, label] of Object.entries(SOCIAL_DOMAINS)) {
    if (html.toLowerCase().includes(domain)) found.add(label);
  }
  return Array.from(found);
}

function extractPricing(html: string): string[] {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const matches: string[] = [];
  for (const re of PRICING_PATTERNS) {
    const all = text.match(new RegExp(re.source, "gi"));
    if (all) matches.push(...all.slice(0, 3));
  }
  return Array.from(new Set(matches)).slice(0, 6);
}

function detectTestimonials(html: string): boolean {
  const lower = html.toLowerCase();
  return TESTIMONIAL_WORDS.some((w) => lower.includes(w));
}

function countWords(html: string): number {
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AuditBot/1.0)" },
      signal: AbortSignal.timeout(12000),
      redirect: "follow",
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

export async function scanCompetitor(rawUrl: string): Promise<CompetitorData> {
  let url = rawUrl.trim();
  if (!url.startsWith("http")) url = `https://${url}`;
  const parsed = new URL(url);
  const domain = parsed.hostname.replace(/^www\./, "");

  const html = await fetchHtml(url);
  if (!html) {
    return {
      domain,
      headline: "",
      tagline: "",
      pricingMentions: [],
      ctas: [],
      socialPlatforms: [],
      hasTestimonials: false,
      wordCount: 0,
      error: "Não foi possível acessar o site",
    };
  }

  const h1s = extractTagText(html, "h1");
  const title = extractTagText(html, "title")[0] || "";
  const metaDesc = extractMetaContent(html, "description");
  const ogTitle = extractMetaContent(html, "title");
  const ogDesc = extractMetaContent(html, "description");

  return {
    domain,
    headline: h1s[0] || ogTitle || title || "",
    tagline: metaDesc || ogDesc || "",
    pricingMentions: extractPricing(html),
    ctas: extractCTAs(html),
    socialPlatforms: extractSocial(html),
    hasTestimonials: detectTestimonials(html),
    wordCount: countWords(html),
  };
}

export async function scanMultipleCompetitors(urls: string[]): Promise<CompetitorData[]> {
  return Promise.all(urls.map((u) => scanCompetitor(u)));
}
