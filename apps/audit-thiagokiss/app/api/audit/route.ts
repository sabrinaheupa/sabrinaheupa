import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-runner";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 300;

const Schema = z.object({
  url: z
    .string()
    .url("URL inválida")
    .refine((u) => u.startsWith("http://") || u.startsWith("https://"), "URL precisa começar com http(s)"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = Schema.parse(body);
    const result = await runAudit(url);
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    console.error("[audit] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
