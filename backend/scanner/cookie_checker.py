"""
Cookie security checker.
Analyzes cookies for Secure, HttpOnly, and SameSite flags.
"""

import logging
from typing import List, Dict

import httpx

logger = logging.getLogger(__name__)


async def check_cookies(url: str) -> List[Dict]:
    """
    Analyze cookies set by the target URL.

    For each cookie, checks:
    - Secure flag (cookie only sent over HTTPS)
    - HttpOnly flag (cookie not accessible via JavaScript)
    - SameSite attribute (CSRF protection)

    Args:
        url: The full URL to check.

    Returns:
        List of dicts with keys: name, secure, httponly, samesite
    """
    cookies_result = []

    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            verify=False,
            follow_redirects=True,
        ) as client:
            response = await client.get(url)

            # Parse Set-Cookie headers
            set_cookie_headers = response.headers.multi_items()

            for header_name, header_value in set_cookie_headers:
                if header_name.lower() != "set-cookie":
                    continue

                cookie_info = _parse_set_cookie(header_value)
                cookies_result.append(cookie_info)

    except Exception as e:
        logger.warning(f"Cookie check failed for {url}: {str(e)}")

    return cookies_result


def _parse_set_cookie(header_value: str) -> dict:
    """
    Parse a Set-Cookie header value and extract security attributes.

    Args:
        header_value: The raw Set-Cookie header string.

    Returns:
        dict with keys: name, secure, httponly, samesite
    """
    parts = header_value.split(";")

    # First part is name=value
    name = "unknown"
    if parts:
        name_value = parts[0].strip()
        if "=" in name_value:
            name = name_value.split("=", 1)[0].strip()

    # Check attributes (case-insensitive)
    lower_parts = [p.strip().lower() for p in parts[1:]]

    secure = any(p == "secure" for p in lower_parts)
    httponly = any(p == "httponly" for p in lower_parts)

    samesite = "Not Set"
    for part in lower_parts:
        if part.startswith("samesite="):
            samesite = part.split("=", 1)[1].strip().capitalize()
            break

    return {
        "name": name,
        "secure": secure,
        "httponly": httponly,
        "samesite": samesite,
    }
