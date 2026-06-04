import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AuditPDF } from "@/lib/pdf-template";
import type { AuditResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

let cachedLogoDataUri: string | null = null;

function getLogoDataUri(): string {
  if (cachedLogoDataUri) return cachedLogoDataUri;
  const candidatePaths = [
    join(process.cwd(), "public", "logo-thiagokiss.png"),
    join(process.cwd(), "apps", "audit-thiagokiss", "public", "logo-thiagokiss.png"),
    join(process.cwd(), ".next", "standalone", "public", "logo-thiagokiss.png"),
  ];
  for (const path of candidatePaths) {
    try {
      const buf = readFileSync(path);
      cachedLogoDataUri = `data:image/png;base64,${buf.toString("base64")}`;
      return cachedLogoDataUri;
    } catch {
      continue;
    }
  }
  throw new Error(`logo-thiagokiss.png não encontrado em nenhum dos caminhos: ${candidatePaths.join(", ")}`);
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as AuditResult;
    if (!data || !data.subagents) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }
    const logoUrl = getLogoDataUri();
    const element = createElement(AuditPDF, { data, logoUrl }) as unknown as ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(element);
    const filename = `auditoria-${data.domain}-${new Date().toISOString().slice(0, 10)}.pdf`;
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    console.error("[pdf] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
