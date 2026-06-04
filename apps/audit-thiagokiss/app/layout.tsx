import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auditoria de Marketing | Consultoria Thiago Kiss",
  description: "Análise estratégica de marketing em 6 dimensões. Relatório executivo em PDF com plano de ação priorizado.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-tk-black text-tk-bone grain min-h-screen antialiased">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
