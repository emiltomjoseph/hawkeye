"""
HTTPS security checker.
Checks HTTPS availability, HTTP→HTTPS redirect, and HSTS header.
"""

import logging

import httpx

logger = logging.getLogger(__name__)


async def check_https(domain: str) -> dict:
    """
    Perform HTTPS-related security checks on a domain.

    Checks:
    - Whether HTTPS is available (port 443 responds)
    - Whether HTTP redirects to HTTPS
    - Whether HSTS header is present

    Args:
        domain: The domain name to check.

    Returns:
        dict with keys: available, redirect, hsts
    """
    result = {
        "available": False,
        "redirect": False,
        "hsts": False,
    }

    # Check if HTTPS is available
    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            verify=False,
            follow_redirects=False,
        ) as client:
            response = await client.get(f"https://{domain}")
            result["available"] = True

            # Check for HSTS header
            hsts_value = response.headers.get("strict-transport-security", "")
            result["hsts"] = bool(hsts_value)

    except Exception as e:
        logger.debug(f"HTTPS not available for {domain}: {e}")

    # Check if HTTP redirects to HTTPS
    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            verify=False,
            follow_redirects=False,
        ) as client:
            response = await client.get(f"http://{domain}")

            if response.status_code in (301, 302, 307, 308):
                location = response.headers.get("location", "")
                result["redirect"] = location.startswith("https://")

    except Exception as e:
        logger.debug(f"HTTP redirect check failed for {domain}: {e}")

    # If HSTS wasn't found on initial request, check with redirects followed
    if result["available"] and not result["hsts"]:
        try:
            async with httpx.AsyncClient(
                timeout=10.0,
                verify=False,
                follow_redirects=True,
            ) as client:
                response = await client.get(f"https://{domain}")
                hsts_value = response.headers.get("strict-transport-security", "")
                result["hsts"] = bool(hsts_value)
        except Exception:
            pass

    return result
