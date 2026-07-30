import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#about" },
    { label: "New Scan", href: "/new-scan" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Changelog", href: "/changelog" },
  ],
  project: [
    { label: "GitHub", href: "https://github.com/emiltomjoseph/hawkeye" },
    { label: "Report Issue", href: "https://github.com/emiltomjoseph/hawkeye/issues" },
    { label: "Contribute", href: "https://github.com/emiltomjoseph/hawkeye/blob/main/docs/contribution-guide.md" },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-border/40 px-5 sm:px-8 pt-12 pb-8">
      <div className="mx-auto max-w-6xl">
        {/* Top section: Logo + Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg
                width="22"
                height="22"
                viewBox="0 0 28 28"
                fill="none"
                className="text-talon"
                aria-hidden="true"
              >
                <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="14" cy="14" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="2" fill="currentColor" />
              </svg>
              <span className="font-display text-base font-bold tracking-tight text-bone">
                Hawkeye
              </span>
            </div>
            <p className="text-feather/60 text-sm leading-relaxed max-w-[260px]">
              Open-source web security assessment platform. Scan any URL for misconfigurations and vulnerabilities.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-body text-xs font-semibold text-feather uppercase tracking-wide mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-feather/60 text-sm hover:text-bone transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-body text-xs font-semibold text-feather uppercase tracking-wide mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-feather/60 text-sm hover:text-bone transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Links */}
          <div>
            <h3 className="font-body text-xs font-semibold text-feather uppercase tracking-wide mb-4">
              Project
            </h3>
            <ul className="space-y-2">
              {footerLinks.project.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-feather/60 text-xs hover:text-bone transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-feather/40 text-xs font-mono">
            © {new Date().getFullYear()} Hawkeye. Open source under MIT License.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/emiltomjoseph/hawkeye"
              target="_blank"
              rel="noopener noreferrer"
              className="text-feather/40 hover:text-bone transition-colors"
              aria-label="GitHub Repository"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
