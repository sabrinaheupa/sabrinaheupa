export interface SubagentResult {
  id: string;
  label: string;
  weight: number;
  score: number;
  summary: string;
  dimensions: { name: string; score: number; finding: string }[];
  wins: string[];
  fixes: {
    severity: "Critical" | "High" | "Medium" | "Low";
    title: string;
    recommendation: string;
    impact: string;
  }[];
  rewrites: { page: string; before: string; after: string; why: string }[];
}

export interface CompetitorData {
  domain: string;
  headline: string;
  tagline: string;
  pricingMentions: string[];
  ctas: string[];
  socialPlatforms: string[];
  hasTestimonials: boolean;
  wordCount: number;
  error?: string;
}

export interface CompetitorAnalysis {
  competitors: CompetitorData[];
  comparison: {
    headline: string;
    pricing: string;
    differentiation: string;
    biggestThreat: string;
    biggestOpportunity: string;
  };
  recommendations: string[];
}

export interface AuditResult {
  url: string;
  domain: string;
  date: string;
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  executiveSummary: string;
  subagents: SubagentResult[];
  competitorAnalysis: CompetitorAnalysis | null;
  quickWins: string[];
  mediumTerm: string[];
  strategic: string[];
}
