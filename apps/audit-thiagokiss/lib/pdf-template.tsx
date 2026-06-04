import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { AuditResult } from "./types";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2", fontWeight: 700 },
  ],
});

const C = {
  black: "#000000",
  ink: "#0A0A0A",
  graphite: "#1A1A1A",
  ash: "#2A2A2A",
  smoke: "#6E6E6E",
  bone: "#E8E4DC",
  paper: "#F5F2EC",
  accent: "#C9A961",
  ok: "#7BAE65",
  warn: "#D4A52D",
  bad: "#C8553D",
};

const s = StyleSheet.create({
  page: { backgroundColor: C.paper, color: C.ink, padding: 40, fontFamily: "Helvetica", fontSize: 10, lineHeight: 1.5 },
  coverPage: { backgroundColor: C.black, color: C.bone, padding: 50, fontFamily: "Helvetica" },
  logo: { width: 140, height: 34, marginBottom: 32, objectFit: "contain" },
  coverTitleSm: { fontSize: 10, letterSpacing: 4, color: C.accent, marginBottom: 6, textTransform: "uppercase" },
  coverTitle: { fontSize: 42, fontWeight: 700, color: C.paper, marginBottom: 24, lineHeight: 1.1 },
  coverDivider: { width: 60, height: 2, backgroundColor: C.accent, marginVertical: 30 },
  coverMeta: { fontSize: 10, color: C.smoke, marginBottom: 4 },
  coverDomain: { fontSize: 18, color: C.bone, marginBottom: 40, fontWeight: 600 },
  coverScoreBox: { marginTop: 60, padding: 30, borderWidth: 1, borderColor: C.ash, alignItems: "center" },
  coverScoreLabel: { fontSize: 9, letterSpacing: 3, color: C.smoke, textTransform: "uppercase", marginBottom: 12 },
  coverScoreValue: { fontSize: 96, fontWeight: 700, color: C.accent, lineHeight: 1 },
  coverScoreGrade: { fontSize: 14, color: C.bone, marginTop: 8, letterSpacing: 2 },
  coverFooter: { position: "absolute", bottom: 40, left: 50, right: 50, fontSize: 9, color: C.smoke, textAlign: "center", letterSpacing: 1 },

  pageHeader: { alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.ash },
  pageHeaderLogo: { width: 70, height: 17, marginBottom: 10, objectFit: "contain" },
  h1: { fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 2, textAlign: "center" },
  h1Sm: { fontSize: 7, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 4, textAlign: "center" },
  h2: { fontSize: 10, fontWeight: 700, color: C.ink, marginTop: 10, marginBottom: 5, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: C.ash },
  h3: { fontSize: 10, fontWeight: 700, color: C.ink, marginTop: 10, marginBottom: 3 },
  scoreBlock: { flexDirection: "row", justifyContent: "center", alignItems: "baseline", marginTop: 6, marginBottom: 0 },
  scoreBig: { fontSize: 16, fontWeight: 700 },
  scoreSlash: { fontSize: 9, color: C.smoke, marginLeft: 2 },
  p: { fontSize: 9, color: C.graphite, marginBottom: 5, lineHeight: 1.45 },
  pSm: { fontSize: 9, color: C.smoke, marginBottom: 4 },

  bar: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  barLabel: { width: 150, fontSize: 8, color: C.ink },
  barTrack: { flex: 1, height: 6, backgroundColor: C.bone, borderRadius: 2 },
  barFill: { height: 6, borderRadius: 2 },
  barScore: { width: 30, textAlign: "right", fontSize: 8, fontWeight: 700, color: C.ink, marginLeft: 6 },

  fixRow: { flexDirection: "row", marginBottom: 8, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: C.bone },
  fixBadge: { width: 60, padding: 3, fontSize: 7, fontWeight: 700, color: C.paper, textAlign: "center", marginRight: 10, letterSpacing: 0.5 },
  fixBody: { flex: 1 },
  fixTitle: { fontSize: 10, fontWeight: 700, color: C.ink, marginBottom: 2 },
  fixRec: { fontSize: 9, color: C.graphite, marginBottom: 2 },
  fixImpact: { fontSize: 8, color: C.smoke, fontStyle: "italic" },

  numList: { marginLeft: 4 },
  numItem: { flexDirection: "row", marginBottom: 6 },
  numIdx: { width: 18, fontSize: 10, fontWeight: 700, color: C.accent },
  numText: { flex: 1, fontSize: 10, color: C.graphite, lineHeight: 1.5 },

  compTable: { marginTop: 10, marginBottom: 12, borderWidth: 0.5, borderColor: C.ash },
  compRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: C.ash },
  compRowHead: { flexDirection: "row", backgroundColor: C.ink, borderBottomWidth: 0.5, borderBottomColor: C.ash },
  compCellLabel: { width: 90, padding: 6, fontSize: 8, fontWeight: 700, color: C.ink, backgroundColor: C.bone },
  compCellLabelHead: { width: 90, padding: 6, fontSize: 8, fontWeight: 700, color: C.paper },
  compCell: { flex: 1, padding: 6, fontSize: 8, color: C.graphite, borderLeftWidth: 0.5, borderLeftColor: C.ash },
  compCellHead: { flex: 1, padding: 6, fontSize: 8, fontWeight: 700, color: C.paper, borderLeftWidth: 0.5, borderLeftColor: C.ash, textAlign: "center" },
  compInsight: { padding: 10, backgroundColor: C.bone, marginBottom: 8 },
  compInsightLabel: { fontSize: 7, letterSpacing: 2, color: C.accent, textTransform: "uppercase", marginBottom: 3 },
  compInsightText: { fontSize: 10, color: C.ink, lineHeight: 1.5 },

  compSummary: { marginTop: 10, marginBottom: 10, padding: 8, borderLeftWidth: 2, borderLeftColor: C.accent, backgroundColor: C.bone },
  compSummaryEyebrow: { fontSize: 6, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 3 },
  compSummaryTitle: { fontSize: 9, fontWeight: 700, color: C.ink, marginBottom: 4 },
  compSummaryDomains: { fontSize: 7, color: C.smoke, marginBottom: 6 },
  compSummaryRow: { flexDirection: "row", marginBottom: 2, alignItems: "flex-start" },
  compSummaryRowLast: { flexDirection: "row", alignItems: "flex-start" },
  compSummaryLabel: { width: 70, fontSize: 6, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1, paddingTop: 1 },
  compSummaryValue: { flex: 1, fontSize: 7.5, color: C.graphite, lineHeight: 1.3 },
  compSummaryRef: { fontSize: 6, color: C.smoke, fontStyle: "italic", marginTop: 4, textAlign: "right" },

  footer: { position: "absolute", bottom: 20, left: 40, right: 40, alignItems: "center", fontSize: 8, color: C.smoke },
  footerText: { fontSize: 8, color: C.smoke, textAlign: "center", letterSpacing: 0.5 },
  footerPage: { fontSize: 8, color: C.smoke, marginTop: 3 },
});

function scoreColor(score: number): string {
  if (score >= 75) return C.ok;
  if (score >= 50) return C.warn;
  return C.bad;
}

function severityColor(sev: string): string {
  if (sev === "Critical") return C.bad;
  if (sev === "High") return "#E08A3E";
  if (sev === "Medium") return C.warn;
  return C.smoke;
}

interface Props {
  data: AuditResult;
  logoUrl: string;
}

export function AuditPDF({ data, logoUrl }: Props) {
  return (
    <Document title={`Auditoria de Marketing — ${data.domain}`} author="Consultoria Thiago Kiss">
      {/* COVER */}
      <Page size="A4" style={s.coverPage}>
        <Image src={logoUrl} style={s.logo} />
        <Text style={s.coverTitleSm}>Consultoria Thiago Kiss</Text>
        <Text style={s.coverTitle}>Auditoria de{"\n"}Marketing</Text>
        <View style={s.coverDivider} />
        <Text style={s.coverMeta}>Análise do site</Text>
        <Text style={s.coverDomain}>{data.domain}</Text>
        <Text style={s.coverMeta}>{data.date}</Text>

        <View style={s.coverScoreBox}>
          <Text style={s.coverScoreLabel}>Score Global de Marketing</Text>
          <Text style={s.coverScoreValue}>{data.overallScore}</Text>
          <Text style={s.coverScoreGrade}>Conceito {data.grade}  ·  Escala 0-100</Text>
        </View>

        <Text style={s.coverFooter}>Relatório estratégico confidencial — Consultoria Thiago Kiss</Text>
      </Page>

      {/* EXECUTIVE SUMMARY */}
      <Page size="A4" style={s.page}>
        <View style={s.pageHeader}>
          <Image src={logoUrl} style={s.pageHeaderLogo} />
          <Text style={s.h1Sm}>Sumário Executivo</Text>
          <Text style={s.h1}>O panorama de marketing</Text>
        </View>
        {data.executiveSummary.split(/\n\n+/).map((para, i) => (
          <Text key={i} style={s.p}>{para}</Text>
        ))}

        {data.competitorAnalysis && data.competitorAnalysis.competitors.length > 0 && (
          <View style={s.compSummary} wrap={false}>
            <Text style={s.compSummaryEyebrow}>Análise competitiva — resumo</Text>
            <Text style={s.compSummaryTitle}>Como o site se posiciona no mercado</Text>
            <Text style={s.compSummaryDomains}>
              {data.competitorAnalysis.competitors.map((c) => c.domain).join("  ·  ")}
            </Text>
            <View style={s.compSummaryRow}>
              <Text style={s.compSummaryLabel}>Ameaça</Text>
              <Text style={s.compSummaryValue}>{data.competitorAnalysis.comparison.biggestThreat}</Text>
            </View>
            <View style={s.compSummaryRow}>
              <Text style={s.compSummaryLabel}>Oportunidade</Text>
              <Text style={s.compSummaryValue}>{data.competitorAnalysis.comparison.biggestOpportunity}</Text>
            </View>
            <View style={s.compSummaryRowLast}>
              <Text style={s.compSummaryLabel}>Diferencial</Text>
              <Text style={s.compSummaryValue}>{data.competitorAnalysis.comparison.differentiation}</Text>
            </View>
            <Text style={s.compSummaryRef}>Tabela comparativa completa na página {3 + data.subagents.length}</Text>
          </View>
        )}

        <View wrap={false}>
          <Text style={s.h2}>Pontuação por dimensão</Text>
          {data.subagents.map((r) => (
            <View key={r.id} style={s.bar}>
              <Text style={s.barLabel}>{r.label}</Text>
              <View style={s.barTrack}>
                <View style={{ ...s.barFill, width: `${r.score}%`, backgroundColor: scoreColor(r.score) }} />
              </View>
              <Text style={s.barScore}>{r.score}</Text>
            </View>
          ))}
        </View>
        <Footer page={2} domain={data.domain} />
      </Page>

      {/* DETAILED FINDINGS */}
      {data.subagents.map((agent, idx) => (
        <Page key={agent.id} size="A4" style={s.page}>
          <View style={s.pageHeader}>
            <Image src={logoUrl} style={s.pageHeaderLogo} />
            <Text style={s.h1Sm}>{`Dimensão ${idx + 1} de ${data.subagents.length}`}</Text>
            <Text style={s.h1}>{agent.label}</Text>
            <View style={s.scoreBlock}>
              <Text style={{ ...s.scoreBig, color: scoreColor(agent.score) }}>{agent.score}</Text>
              <Text style={s.scoreSlash}>/100</Text>
            </View>
          </View>
          <Text style={s.p}>{agent.summary}</Text>

          {agent.wins.length > 0 && (
            <>
              <Text style={s.h3}>O que está funcionando</Text>
              {agent.wins.map((w, i) => (
                <Text key={i} style={{ ...s.p, marginBottom: 3 }}>· {w}</Text>
              ))}
            </>
          )}

          {agent.fixes.length > 0 && (
            <>
              <Text style={s.h2}>O que ajustar</Text>
              {agent.fixes.map((fix, i) => (
                <View key={i} style={s.fixRow} wrap={false}>
                  <Text style={{ ...s.fixBadge, backgroundColor: severityColor(fix.severity) }}>{fix.severity.toUpperCase()}</Text>
                  <View style={s.fixBody}>
                    <Text style={s.fixTitle}>{fix.title}</Text>
                    <Text style={s.fixRec}>→ {fix.recommendation}</Text>
                    <Text style={s.fixImpact}>Impacto: {fix.impact}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {agent.rewrites.length > 0 && (
            <>
              <Text style={s.h2}>Reescritas sugeridas</Text>
              {agent.rewrites.slice(0, 2).map((rw, i) => (
                <View key={i} style={{ marginBottom: 10, padding: 10, backgroundColor: C.bone }} wrap={false}>
                  <Text style={{ ...s.pSm, fontWeight: 700, marginBottom: 2 }}>{rw.page}</Text>
                  <Text style={{ ...s.pSm, marginBottom: 2 }}>Antes:</Text>
                  <Text style={{ ...s.p, fontStyle: "italic", marginBottom: 6 }}>&ldquo;{rw.before}&rdquo;</Text>
                  <Text style={{ ...s.pSm, marginBottom: 2, color: C.accent }}>Depois:</Text>
                  <Text style={{ ...s.p, marginBottom: 6 }}>&ldquo;{rw.after}&rdquo;</Text>
                  <Text style={s.fixImpact}>{rw.why}</Text>
                </View>
              ))}
            </>
          )}

          <Footer page={3 + idx} domain={data.domain} />
        </Page>
      ))}

      {/* COMPETITOR ANALYSIS */}
      {data.competitorAnalysis && data.competitorAnalysis.competitors.length > 0 && (
        <Page size="A4" style={s.page}>
          <View style={s.pageHeader}>
            <Image src={logoUrl} style={s.pageHeaderLogo} />
            <Text style={s.h1Sm}>Análise Competitiva</Text>
            <Text style={s.h1}>O que os concorrentes fazem</Text>
          </View>

          <View style={s.compTable} wrap={false}>
            <View style={s.compRowHead}>
              <Text style={s.compCellLabelHead}>Dimensão</Text>
              <Text style={s.compCellHead}>{data.domain}</Text>
              {data.competitorAnalysis.competitors.map((c) => (
                <Text key={c.domain} style={s.compCellHead}>{c.domain}</Text>
              ))}
            </View>

            <View style={s.compRow}>
              <Text style={s.compCellLabel}>Headline</Text>
              <Text style={s.compCell}>—</Text>
              {data.competitorAnalysis.competitors.map((c) => (
                <Text key={c.domain} style={s.compCell}>{c.headline ? (c.headline.length > 60 ? c.headline.slice(0, 60) + "…" : c.headline) : "—"}</Text>
              ))}
            </View>

            <View style={s.compRow}>
              <Text style={s.compCellLabel}>Pricing visível</Text>
              <Text style={s.compCell}>—</Text>
              {data.competitorAnalysis.competitors.map((c) => (
                <Text key={c.domain} style={s.compCell}>{c.pricingMentions.length > 0 ? "Sim" : "Não"}</Text>
              ))}
            </View>

            <View style={s.compRow}>
              <Text style={s.compCellLabel}>CTAs</Text>
              <Text style={s.compCell}>—</Text>
              {data.competitorAnalysis.competitors.map((c) => (
                <Text key={c.domain} style={s.compCell}>{c.ctas.slice(0, 2).join(", ") || "—"}</Text>
              ))}
            </View>

            <View style={s.compRow}>
              <Text style={s.compCellLabel}>Depoimentos</Text>
              <Text style={s.compCell}>—</Text>
              {data.competitorAnalysis.competitors.map((c) => (
                <Text key={c.domain} style={s.compCell}>{c.hasTestimonials ? "Sim" : "Não"}</Text>
              ))}
            </View>

            <View style={s.compRow}>
              <Text style={s.compCellLabel}>Social</Text>
              <Text style={s.compCell}>—</Text>
              {data.competitorAnalysis.competitors.map((c) => (
                <Text key={c.domain} style={s.compCell}>{c.socialPlatforms.length}</Text>
              ))}
            </View>
          </View>

          <View style={s.compInsight} wrap={false}>
            <Text style={s.compInsightLabel}>Maior ameaça</Text>
            <Text style={s.compInsightText}>{data.competitorAnalysis.comparison.biggestThreat}</Text>
          </View>

          <View style={s.compInsight} wrap={false}>
            <Text style={s.compInsightLabel}>Maior oportunidade</Text>
            <Text style={s.compInsightText}>{data.competitorAnalysis.comparison.biggestOpportunity}</Text>
          </View>

          <Text style={s.h2}>Diferenciação e posicionamento</Text>
          <Text style={s.p}>{data.competitorAnalysis.comparison.differentiation}</Text>

          <Text style={s.h2}>Recomendações competitivas</Text>
          <View style={s.numList}>
            {data.competitorAnalysis.recommendations.map((rec, i) => (
              <View key={i} style={s.numItem}>
                <Text style={s.numIdx}>{String(i + 1).padStart(2, "0")}</Text>
                <Text style={s.numText}>{rec}</Text>
              </View>
            ))}
          </View>

          <Footer page={3 + data.subagents.length} domain={data.domain} />
        </Page>
      )}

      {/* ACTION PLAN */}
      <Page size="A4" style={s.page}>
        <View style={s.pageHeader}>
          <Image src={logoUrl} style={s.pageHeaderLogo} />
          <Text style={s.h1Sm}>Plano de Ação</Text>
          <Text style={s.h1}>O caminho recomendado</Text>
        </View>

        <Text style={s.h2}>Ganhos rápidos (esta semana)</Text>
        <View style={s.numList}>
          {data.quickWins.map((w, i) => (
            <View key={i} style={s.numItem}>
              <Text style={s.numIdx}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={s.numText}>{w}</Text>
            </View>
          ))}
        </View>

        <Text style={s.h2}>Médio prazo (1-3 meses)</Text>
        <View style={s.numList}>
          {data.mediumTerm.map((w, i) => (
            <View key={i} style={s.numItem}>
              <Text style={s.numIdx}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={s.numText}>{w}</Text>
            </View>
          ))}
        </View>

        <Text style={s.h2}>Iniciativas estratégicas (3-6 meses)</Text>
        <View style={s.numList}>
          {data.strategic.map((w, i) => (
            <View key={i} style={s.numItem}>
              <Text style={s.numIdx}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={s.numText}>{w}</Text>
            </View>
          ))}
        </View>

        <Footer page={3 + data.subagents.length + (data.competitorAnalysis ? 1 : 0)} domain={data.domain} />
      </Page>
    </Document>
  );
}

function Footer({ page, domain }: { page: number; domain: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>Consultoria Thiago Kiss · Auditoria de Marketing · {domain}</Text>
      <Text style={s.footerPage}>— {page} —</Text>
    </View>
  );
}
