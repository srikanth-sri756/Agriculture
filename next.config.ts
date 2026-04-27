import type { NextConfig } from "next";

const securityHeaders = [
  // Disable embedding the site in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer leakage
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down sensitive browser APIs by default
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(self), interest-cohort=()",
  },
  // Force HTTPS in production (no-op on http://localhost during dev)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // DNS prefetch
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Cross-origin isolation (kept permissive for Next dev / images)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.2.86", "192.168.2.46"],
  // Don't expose Next.js version in HTTP responses
  poweredByHeader: false,
  // Apply the security headers above to every route
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
