import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/audit",
  output: "standalone",
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
