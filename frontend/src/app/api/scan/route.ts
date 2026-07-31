import { NextResponse } from "next/server";
import * as https from "https";
import * as http from "http";

export const maxDuration = 15; // Set max execution time for Vercel

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URL
    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const parsedUrl = new URL(targetUrl);
    
    // Security Findings state
    const findings = {
      https: { status: "pass", detail: "HTTPS is active." },
      headers: { status: "critical", detail: "Missing multiple security headers." },
      cookies: { status: "pass", detail: "No insecure cookies detected." },
      robots: { status: "pass", detail: "No issues with robots.txt." },
      tech: { status: "pass", detail: "No severe tech stack exposures detected." }
    };
    
    let score = 100;

    // 1. Perform main fetch to get headers
    let res: Response | null = null;
    try {
      res = await fetch(parsedUrl.toString(), {
        method: "GET",
        headers: {
          "User-Agent": "Hawkeye-Security-Scanner/1.0",
        },
        // We do not want to follow redirects too deeply, but fetch will handle standard ones
      });
      
      if (parsedUrl.protocol !== "https:") {
        findings.https = { status: "critical", detail: "Target is not using HTTPS. Data is transmitted in plaintext." };
        score -= 30;
      } else {
        findings.https = { status: "pass", detail: "Target is using HTTPS. Communication is encrypted." };
      }
      
      // Analyze Headers
      const headers = res.headers;
      const missingHeaders = [];
      const presentHeaders = [];
      
      const hsts = headers.get("strict-transport-security");
      const csp = headers.get("content-security-policy");
      const xFrame = headers.get("x-frame-options");
      const xContentType = headers.get("x-content-type-options");
      
      if (!csp) { missingHeaders.push("CSP"); score -= 15; } else { presentHeaders.push("CSP"); }
      if (!hsts && parsedUrl.protocol === "https:") { missingHeaders.push("HSTS"); score -= 10; } else if (hsts) { presentHeaders.push("HSTS"); }
      if (!xFrame) { missingHeaders.push("X-Frame-Options"); score -= 10; } else { presentHeaders.push("X-Frame-Options"); }
      if (!xContentType) { missingHeaders.push("X-Content-Type-Options"); score -= 5; } else { presentHeaders.push("X-Content-Type-Options"); }
      
      if (missingHeaders.length === 0) {
        findings.headers = { status: "pass", detail: `Excellent! Found: ${presentHeaders.join(", ")}` };
      } else if (missingHeaders.length <= 2) {
        findings.headers = { status: "warning", detail: `Missing some headers: ${missingHeaders.join(", ")}. Found: ${presentHeaders.join(", ")}` };
      } else {
        findings.headers = { status: "critical", detail: `Missing critical headers: ${missingHeaders.join(", ")}` };
      }

      // Analyze Cookies
      const setCookie = headers.get("set-cookie");
      if (setCookie) {
        const hasSecure = setCookie.toLowerCase().includes("secure");
        const hasHttpOnly = setCookie.toLowerCase().includes("httponly");
        
        if (!hasSecure || !hasHttpOnly) {
          findings.cookies = { status: "warning", detail: "Cookies are missing 'Secure' or 'HttpOnly' flags." };
          score -= 10;
        } else {
          findings.cookies = { status: "pass", detail: "Cookies have 'Secure' and 'HttpOnly' flags." };
        }
      } else {
        findings.cookies = { status: "pass", detail: "No cookies set in the initial response." };
      }

      // Analyze Tech Stack (Server, X-Powered-By)
      const server = headers.get("server");
      const xPoweredBy = headers.get("x-powered-by");
      
      let techInfo = [];
      if (server) techInfo.push(`Server: ${server}`);
      if (xPoweredBy) techInfo.push(`Powered-By: ${xPoweredBy}`);
      
      if (techInfo.length > 0) {
        findings.tech = { status: "warning", detail: `Tech stack exposed: ${techInfo.join(" | ")}. Consider hiding this info.` };
        score -= 5;
      } else {
        findings.tech = { status: "pass", detail: "Server configuration headers are well hidden." };
      }
      
    } catch (e: any) {
      // If we can't fetch, it's critical
      return NextResponse.json({ error: `Failed to connect to target: ${e.message}` }, { status: 500 });
    }

    // 2. Check robots.txt
    try {
      const robotsUrl = new URL("/robots.txt", parsedUrl.toString());
      const robotsRes = await fetch(robotsUrl.toString(), { method: "HEAD" });
      if (robotsRes.ok) {
        findings.robots = { status: "pass", detail: "robots.txt is present." };
      } else {
        findings.robots = { status: "warning", detail: "robots.txt not found (404)." };
        score -= 5;
      }
    } catch {
      findings.robots = { status: "warning", detail: "Failed to fetch robots.txt." };
    }
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Construct final ScanResult
    const scanId = `scan-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
    const result = {
      id: scanId,
      url: parsedUrl.toString(),
      scannedAt: new Date().toISOString(),
      score,
      categories: [
        { name: "HTTPS / SSL", status: findings.https.status, detail: findings.https.detail },
        { name: "Security Headers", status: findings.headers.status, detail: findings.headers.detail },
        { name: "Cookie Security", status: findings.cookies.status, detail: findings.cookies.detail },
        { name: "robots.txt / Sitemap", status: findings.robots.status, detail: findings.robots.detail },
        { name: "Tech Stack", status: findings.tech.status, detail: findings.tech.detail },
      ]
    };

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
