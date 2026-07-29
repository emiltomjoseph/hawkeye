"""
Technology detection engine.
Detects web technologies from HTTP headers and HTML content using signature matching.
"""

import logging
import re
from typing import List

import httpx

logger = logging.getLogger(__name__)

# Technology signatures
HEADER_SIGNATURES = {
    # X-Powered-By patterns
    "PHP": {"header": "x-powered-by", "pattern": r"PHP"},
    "ASP.NET": {"header": "x-powered-by", "pattern": r"ASP\.NET"},
    "Express": {"header": "x-powered-by", "pattern": r"Express"},

    # Server header patterns
    "Apache": {"header": "server", "pattern": r"Apache"},
    "Nginx": {"header": "server", "pattern": r"nginx", "flags": re.IGNORECASE},
    "IIS": {"header": "server", "pattern": r"Microsoft-IIS"},
    "Cloudflare": {"header": "server", "pattern": r"cloudflare", "flags": re.IGNORECASE},
    "LiteSpeed": {"header": "server", "pattern": r"LiteSpeed"},
}

HTML_SIGNATURES = {
    "React": [
        r'<div\s+id=["\']root["\']',
        r'data-reactroot',
        r'_reactRootContainer',
        r'__REACT_DEVTOOLS',
    ],
    "Next.js": [
        r'__NEXT_DATA__',
        r'/_next/static',
        r'/_next/image',
        r'next/dist',
    ],
    "Vue.js": [
        r'<div\s+id=["\']app["\'].*v-',
        r'__vue__',
        r'Vue\.js',
        r'data-v-[a-f0-9]',
    ],
    "Angular": [
        r'ng-version=',
        r'ng-app',
        r'<app-root',
        r'angular\.js',
    ],
    "jQuery": [
        r'jquery[.-][\d]',
        r'jquery\.min\.js',
    ],
    "WordPress": [
        r'wp-content/',
        r'wp-includes/',
        r'wp-json',
        r'wordpress',
    ],
    "Drupal": [
        r'drupal\.js',
        r'Drupal\.settings',
        r'/sites/default/files',
    ],
    "Bootstrap": [
        r'bootstrap\.min\.css',
        r'bootstrap\.min\.js',
        r'bootstrap\.css',
    ],
    "Tailwind CSS": [
        r'tailwindcss',
        r'tailwind\.min\.css',
    ],
    "Google Analytics": [
        r'google-analytics\.com',
        r'googletagmanager\.com',
        r'gtag\(',
        r'ga\(',
    ],
    "Google Tag Manager": [
        r'googletagmanager\.com/gtm',
    ],
}

META_GENERATOR_SIGNATURES = {
    "WordPress": r"WordPress",
    "Drupal": r"Drupal",
    "Joomla": r"Joomla",
    "Wix": r"Wix",
    "Squarespace": r"Squarespace",
    "Shopify": r"Shopify",
    "Ghost": r"Ghost",
}


async def detect_technologies(url: str) -> List[str]:
    """
    Detect web technologies used by a website.

    Detection methods:
    1. HTTP header signatures (Server, X-Powered-By)
    2. HTML body pattern matching
    3. Meta generator tag analysis

    Args:
        url: The full URL to analyze.

    Returns:
        List of detected technology names.
    """
    detected = set()

    try:
        async with httpx.AsyncClient(
            timeout=15.0,
            verify=False,
            follow_redirects=True,
        ) as client:
            response = await client.get(url)
            headers = response.headers
            body = response.text

            # 1. Check HTTP headers
            for tech, sig in HEADER_SIGNATURES.items():
                header_value = headers.get(sig["header"], "")
                flags = sig.get("flags", 0)
                if re.search(sig["pattern"], header_value, flags):
                    detected.add(tech)

            # 2. Check HTML body patterns
            for tech, patterns in HTML_SIGNATURES.items():
                for pattern in patterns:
                    if re.search(pattern, body, re.IGNORECASE):
                        detected.add(tech)
                        break  # One match is enough

            # 3. Check meta generator tag
            generator_match = re.search(
                r'<meta\s+name=["\']generator["\']\s+content=["\']([^"\']+)["\']',
                body,
                re.IGNORECASE,
            )
            if generator_match:
                generator_value = generator_match.group(1)
                for tech, pattern in META_GENERATOR_SIGNATURES.items():
                    if re.search(pattern, generator_value, re.IGNORECASE):
                        detected.add(tech)

            # 4. Detect Node.js based on specific headers
            if headers.get("x-powered-by", "").lower() in ("express", "next.js"):
                detected.add("Node.js")

    except Exception as e:
        logger.warning(f"Technology detection failed for {url}: {str(e)}")

    return sorted(list(detected))
