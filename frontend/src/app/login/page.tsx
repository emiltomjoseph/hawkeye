"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Alert } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await api.auth.login({ email, password });
      await login(data.access_token, data.refresh_token);
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-16 sm:py-24 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-xs text-grid tracking-widest uppercase mb-1">
            SYS::AUTH
          </p>
          <h1 className="font-display text-3xl font-bold uppercase text-bone mb-2">
            Log in
          </h1>
          <p className="font-body text-feather text-sm">
            Access your scan history and saved reports.
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full uppercase font-display"
          >
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-feather text-xs font-body">
          No account?{" "}
          <Link href="/signup" className="text-talon hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
