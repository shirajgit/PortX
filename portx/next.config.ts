import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // @sparticuz/chromium reads its compressed Chrome from bin/ at runtime, which the
  // file tracer can't see — without this the PDF function deploys without a browser.
  outputFileTracingIncludes: {
    "/api/pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
};

export default nextConfig;
