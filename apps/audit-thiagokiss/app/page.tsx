"use client";

import { useState } from "react";
import Image from "next/image";
import type { AuditResult } from "@/lib/types";

const STAGES = [
  "Conectando ao site",
  "Analisando conteúdo & mensagem",
  "Avaliando conversão & CRO",
  "Auditando SEO & descoberta",
  "Mapeando posicionamento competitivo",
  "Diagnosticando marca, confiança & crescimento",
  "Sintetizando plano de ação",
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
  }

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const finalUrl = normalizeUrl(url);
    if (!finalUrl) return;

    setLoading(true);
    setStage(0);
    const interval = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 6000);

    try {
      const res = await fetch("/audit/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(errBody.error || `Erro ${res.status}`);
      }
      const data = (await res.json()) as AuditResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  async function downloadPdf() {
    if (!result) return;
    setDownloading(true);
    try {
      const res = await fetch("/audit/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error("Falha ao gerar PDF");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `auditoria-${result.domain}-${new Date().toISOString().slice(0, 10)}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao baixar PDF");
    } finally {
      setDownloading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setUrl("");
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between border-b border-tk-ash/40">
        <Image src="/audit/logo-thiagokiss.png" alt="Thiago Kiss" width={140} height={34} priority />
        <span className="text-[10px] tracking-[0.3em] text-tk-smoke uppercase">Consultoria Thiago Kiss</span>
      </header>

      <section className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-2xl">
          {!result && !loading && (
            <>
              <p className="text-[10px] tracking-[0.4em] text-tk-accent uppercase mb-4">Auditoria de Marketing</p>
              <h1 className="font-display text-5xl md:text-6xl text-tk-paper leading-tight mb-6">
                Onde seu marketing<br />deixa dinheiro<br />na mesa.
              </h1>
              <p className="text-tk-smoke text-base mb-10 max-w-lg leading-relaxed">
                Análise estratégica em 6 dimensões com 5 especialistas trabalhando em paralelo. Resultado em PDF executivo, pronto para a próxima reunião.
              </p>

              <form onSubmit={runAudit} className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-[10px] tracking-[0.2em] text-tk-smoke uppercase mb-2">
                    Site para auditar
                  </label>
                  <input
                    id="url"
                    type="text"
                    inputMode="url"
                    autoComplete="off"
                    placeholder="seusite.com.br"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-tk-graphite/60 border border-tk-ash text-tk-paper text-lg px-5 py-4 focus:outline-none focus:border-tk-accent transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!url.trim()}
                  className="w-full bg-tk-accent text-tk-black font-semibold tracking-wider uppercase text-sm py-4 hover:bg-tk-paper transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Auditar agora
                </button>
              </form>

              <p className="text-tk-smoke text-xs mt-6 leading-relaxed">
                Sem cadastro · sem custo · análise leva 60-90 segundos.
              </p>
            </>
          )}

          {loading && (
            <div className="text-center space-y-8">
              <p className="text-[10px] tracking-[0.4em] text-tk-accent uppercase">Auditando</p>
              <h2 className="font-display text-3xl text-tk-paper">{normalizeUrl(url).replace(/^https?:\/\//, "")}</h2>
              <div className="space-y-3 max-w-md mx-auto text-left">
                {STAGES.map((label, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        i < stage ? "bg-tk-accent" : i === stage ? "bg-tk-accent animate-pulse-soft" : "bg-tk-ash"
                      }`}
                    />
                    <span className={`text-sm ${i <= stage ? "text-tk-paper" : "text-tk-smoke"}`}>{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-tk-smoke text-xs">5 especialistas trabalhando em paralelo. Aguarde 60-90 segundos.</p>
            </div>
          )}

          {error && !loading && (
            <div className="border border-red-900/50 bg-red-950/30 p-6 mt-6 text-red-300">
              <p className="font-semibold mb-2">Algo deu errado</p>
              <p className="text-sm mb-4">{error}</p>
              <button onClick={reset} className="text-xs tracking-wider uppercase text-tk-accent hover:text-tk-paper">
                Tentar de novo →
              </button>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-10">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-tk-accent uppercase mb-2">Auditoria concluída</p>
                <h2 className="font-display text-3xl text-tk-paper mb-1">{result.domain}</h2>
                <p className="text-tk-smoke text-sm">{result.date}</p>
              </div>

              <div className="border border-tk-ash p-8 text-center">
                <p className="text-[10px] tracking-[0.3em] text-tk-smoke uppercase mb-4">Score Global</p>
                <p className="font-display text-7xl text-tk-accent leading-none mb-3">{result.overallScore}</p>
                <p className="text-tk-paper text-sm tracking-[0.2em]">CONCEITO {result.grade}</p>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.3em] text-tk-smoke uppercase">Dimensões</p>
                {result.subagents.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 py-2 border-b border-tk-ash/40">
                    <span className="text-tk-paper text-sm flex-1">{r.label}</span>
                    <div className="w-32 h-1 bg-tk-ash">
                      <div
                        className="h-1 bg-tk-accent"
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                    <span className="text-tk-paper text-sm font-semibold w-10 text-right">{r.score}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={downloadPdf}
                disabled={downloading}
                className="w-full bg-tk-accent text-tk-black font-semibold tracking-wider uppercase text-sm py-4 hover:bg-tk-paper transition-colors disabled:opacity-50"
              >
                {downloading ? "Gerando PDF..." : "Baixar relatório completo (PDF)"}
              </button>

              <button onClick={reset} className="block mx-auto text-xs tracking-wider uppercase text-tk-smoke hover:text-tk-paper">
                Auditar outro site →
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="px-8 py-6 text-center text-[10px] tracking-[0.2em] text-tk-smoke uppercase border-t border-tk-ash/40">
        Consultoria Thiago Kiss · Relatórios estratégicos confidenciais
      </footer>
    </main>
  );
}
