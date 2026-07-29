export interface ScanCategory {
  name: string;
  status: "pass" | "warning" | "critical";
  detail: string;
}

export interface ScanResult {
  id: string;
  url: string;
  scannedAt: string;
  score: number;
  categories: ScanCategory[];
}

export const mockScanResult: ScanResult = {
  id: "scan-001",
  url: "https://example.com",
  scannedAt: "2026-07-25T14:32:00Z",
  score: 62,
  categories: [
    {
      name: "HTTPS / SSL",
      status: "pass",
      detail: "TLS 1.3 active, certificate valid until 2027-03-15, HSTS header present with max-age=31536000",
    },
    {
      name: "Security Headers",
      status: "critical",
      detail: "Content-Security-Policy header not found. X-Frame-Options not set. Strict-Transport-Security present.",
    },
    {
      name: "Cookie Security",
      status: "warning",
      detail: "3 of 5 cookies missing Secure flag. 2 cookies missing HttpOnly. SameSite=Lax on all cookies.",
    },
    {
      name: "robots.txt / Sitemap",
      status: "pass",
      detail: "robots.txt found, 12 disallow rules. sitemap.xml present at /sitemap.xml with 847 URLs indexed.",
    },
    {
      name: "Tech Stack",
      status: "warning",
      detail: "Server: nginx/1.18.0 (outdated, latest 1.27.x). Framework: Next.js 14. jQuery 3.6.0 detected.",
    },
  ],
};

export const mockScanHistory: ScanResult[] = [
  mockScanResult,
  {
    id: "scan-002",
    url: "https://mybank.io",
    scannedAt: "2026-07-24T09:15:00Z",
    score: 91,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "pass",
        detail: "TLS 1.3, HSTS preloaded, certificate pinning detected via Expect-CT header.",
      },
      {
        name: "Security Headers",
        status: "pass",
        detail: "All recommended headers present: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy.",
      },
      {
        name: "Cookie Security",
        status: "pass",
        detail: "All cookies set with Secure, HttpOnly, and SameSite=Strict flags.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "pass",
        detail: "robots.txt present. Sitemap at /sitemap.xml with 234 URLs.",
      },
      {
        name: "Tech Stack",
        status: "warning",
        detail: "Server header exposed: cloudflare. Framework: React 18. No outdated libraries detected.",
      },
    ],
  },
  {
    id: "scan-003",
    url: "https://legacy-shop.net",
    scannedAt: "2026-07-23T16:45:00Z",
    score: 28,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "critical",
        detail: "TLS 1.0 and 1.1 still enabled. Certificate expires in 12 days. No HSTS header.",
      },
      {
        name: "Security Headers",
        status: "critical",
        detail: "No security headers found. Missing CSP, X-Frame-Options, X-Content-Type-Options.",
      },
      {
        name: "Cookie Security",
        status: "critical",
        detail: "Session cookie transmitted over HTTP. No Secure or HttpOnly flags on any cookies.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "warning",
        detail: "robots.txt found but allows all crawlers. No sitemap.xml detected.",
      },
      {
        name: "Tech Stack",
        status: "critical",
        detail: "Server: Apache/2.4.29 (critical CVEs). PHP/7.2 end-of-life. jQuery 2.1.4 with known XSS.",
      },
    ],
  },
  {
    id: "scan-004",
    url: "https://startup-saas.dev",
    scannedAt: "2026-07-22T11:20:00Z",
    score: 74,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "pass",
        detail: "TLS 1.3 only. Let's Encrypt certificate, auto-renewal configured. HSTS with includeSubDomains.",
      },
      {
        name: "Security Headers",
        status: "warning",
        detail: "CSP present but uses unsafe-inline. X-Frame-Options set to SAMEORIGIN. Missing Permissions-Policy.",
      },
      {
        name: "Cookie Security",
        status: "pass",
        detail: "All cookies properly secured with Secure, HttpOnly, SameSite=Strict.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "pass",
        detail: "robots.txt configured. Sitemap present with 156 URLs.",
      },
      {
        name: "Tech Stack",
        status: "pass",
        detail: "Server header hidden. Framework: Remix 2.x. All dependencies up to date.",
      },
    ],
  },
  {
    id: "scan-005",
    url: "https://blog.personal.me",
    scannedAt: "2026-07-21T08:00:00Z",
    score: 53,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "pass",
        detail: "TLS 1.2/1.3. Valid certificate. HSTS present but low max-age (3600).",
      },
      {
        name: "Security Headers",
        status: "warning",
        detail: "X-Content-Type-Options present. Missing CSP and X-Frame-Options headers.",
      },
      {
        name: "Cookie Security",
        status: "warning",
        detail: "Analytics cookies missing SameSite attribute. Session cookie properly configured.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "warning",
        detail: "robots.txt found. No sitemap.xml — 404 at expected paths.",
      },
      {
        name: "Tech Stack",
        status: "warning",
        detail: "WordPress 6.4 detected. 3 plugins with available updates. Server: LiteSpeed.",
      },
    ],
  },
  {
    id: "scan-006",
    url: "https://auth.enterprise-corp.com",
    scannedAt: "2026-07-20T19:40:00Z",
    score: 98,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "pass",
        detail: "TLS 1.3 only, ECC 384-bit cert, HSTS preload enabled with max-age=63072000.",
      },
      {
        name: "Security Headers",
        status: "pass",
        detail: "Strict CSP, Permissions-Policy, Referrer-Policy, X-Frame-Options DENY present.",
      },
      {
        name: "Cookie Security",
        status: "pass",
        detail: "SameSite=Strict, Secure, HttpOnly, and __Host- prefix applied on all tokens.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "pass",
        detail: "Disallow: / on sensitive API paths. Sitemap verified.",
      },
      {
        name: "Tech Stack",
        status: "pass",
        detail: "Server version stripped. Hardened Linux kernel proxy.",
      },
    ],
  },
  {
    id: "scan-007",
    url: "https://dev-sandbox.test",
    scannedAt: "2026-07-19T12:10:00Z",
    score: 35,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "warning",
        detail: "Self-signed SSL certificate. HTTP to HTTPS auto-redirect missing.",
      },
      {
        name: "Security Headers",
        status: "critical",
        detail: "Zero security headers present. CORS configured to Access-Control-Allow-Origin: *.",
      },
      {
        name: "Cookie Security",
        status: "critical",
        detail: "Authentication token stored in unencrypted cookie without Secure flag.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "pass",
        detail: "Disallow: /admin /api /env rules detected.",
      },
      {
        name: "Tech Stack",
        status: "warning",
        detail: "Node.js express stack with exposed stack traces in error responses.",
      },
    ],
  },
  {
    id: "scan-008",
    url: "https://cloud-portal.io",
    scannedAt: "2026-07-18T15:30:00Z",
    score: 82,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "pass",
        detail: "TLS 1.3 active, HSTS present.",
      },
      {
        name: "Security Headers",
        status: "pass",
        detail: "CSP configured with nonce enforcement. X-Frame-Options set to SAMEORIGIN.",
      },
      {
        name: "Cookie Security",
        status: "pass",
        detail: "All auth cookies flagged with HttpOnly and Secure.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "pass",
        detail: "robots.txt and sitemap active.",
      },
      {
        name: "Tech Stack",
        status: "warning",
        detail: "Nginx version string exposed: nginx/1.22.1.",
      },
    ],
  },
  {
    id: "scan-009",
    url: "https://payment-gateway-sandbox.org",
    scannedAt: "2026-07-17T10:15:00Z",
    score: 88,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "pass",
        detail: "TLS 1.3, TLS 1.2 fallback. RSA 4096-bit key.",
      },
      {
        name: "Security Headers",
        status: "pass",
        detail: "Strict-Transport-Security present. CSP configured.",
      },
      {
        name: "Cookie Security",
        status: "pass",
        detail: "All cookies secured with SameSite=Lax and HttpOnly.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "pass",
        detail: "robots.txt disallows crawler indexing of /checkout.",
      },
      {
        name: "Tech Stack",
        status: "warning",
        detail: "Server header: AWS CloudFront. Deprecated JS library detected.",
      },
    ],
  },
  {
    id: "scan-010",
    url: "https://vulnerable-demo.site",
    scannedAt: "2026-07-16T17:00:00Z",
    score: 22,
    categories: [
      {
        name: "HTTPS / SSL",
        status: "critical",
        detail: "Expired SSL certificate! Site throws SSL handshake errors.",
      },
      {
        name: "Security Headers",
        status: "critical",
        detail: "Missing all security headers. Clickjacking vulnerability via missing X-Frame-Options.",
      },
      {
        name: "Cookie Security",
        status: "critical",
        detail: "Session ID in URL query parameters.",
      },
      {
        name: "robots.txt / Sitemap",
        status: "warning",
        detail: "robots.txt missing.",
      },
      {
        name: "Tech Stack",
        status: "critical",
        detail: "Outdated Apache server with unpatched remote code execution vulnerabilities.",
      },
    ],
  },
];

/** Helper: get color class based on score value */
export function getScoreColor(score: number): string {
  if (score >= 70) return "text-pass";
  if (score >= 40) return "text-talon";
  return "text-critical";
}

/** Helper: get status label */
export function getStatusLabel(status: "pass" | "warning" | "critical"): string {
  const labels = { pass: "Pass", warning: "Warning", critical: "Critical" };
  return labels[status];
}

/** Helper: format timestamp */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
