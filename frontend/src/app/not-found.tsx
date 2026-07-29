import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 sm:py-32 text-center">
      <span className="font-mono text-6xl text-feather/20 mb-4">404</span>
      <h1 className="font-display text-2xl mb-3">Page not found</h1>
      <p className="text-feather text-sm max-w-md mb-8">
        Nothing here. You may have followed a broken link or typed the URL incorrectly.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-talon text-ink font-display px-6 py-2.5 text-sm hover:bg-talon/90 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
