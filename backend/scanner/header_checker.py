"""
Security headers checker.
Checks for the presence and values of important security headers.
"""

import logging
from typing import Dict

import httpx

logger = logging.getLogger(__name__)

# Security headers to check
SECURITY_HEADERS = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
]


async def check_security_headers(url: str) -> Dict[str, dict]:
    """
    Check for the presence and values of important security headers.

    Checks for:
    - Content-Security-Policy
    - Strict-Transport-Security
    - X-Frame-Options
    - X-Content-Type-Options
    - Referrer-Policy
    - Permissions-Policy

    Args:
        url: The full URL to check.

    Returns:
        dict mapping header names to {present: bool, value: str|None}
    """
    result = {}

    # Initialize all headers as not present
    for header in SECURITY_HEADERS:
        result[header] = {"present": False, "value": None}

    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            verify=False,
            follow_redirects=True,
        ) as client:
            response = await client.get(url)

            for header in SECURITY_HEADERS:
                value = response.headers.get(header.lower())
                if value:
                    result[header] = {
                        "present": True,
                        "value": value,
                    }

    except Exception as e:
        logger.warning(f"Security headers check failed for {url}: {str(e)}")

    return result
