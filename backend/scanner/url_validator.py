"""
URL validation utilities.
Validates URL format, resolves domain, and checks reachability.
"""

import logging
import asyncio
import socket
from urllib.parse import urlparse

import httpx

logger = logging.getLogger(__name__)


def validate_url_format(url: str) -> dict:
    """
    Validate URL format and extract components.

    Returns:
        dict with keys: valid, scheme, domain, error
    """
    try:
        parsed = urlparse(url)

        if not parsed.scheme:
            # Try with https:// prefix
            parsed = urlparse(f"https://{url}")

        if parsed.scheme not in ("http", "https"):
            return {"valid": False, "scheme": None, "domain": None, "error": "Invalid URL scheme"}

        if not parsed.netloc:
            return {"valid": False, "scheme": None, "domain": None, "error": "No domain found"}

        domain = parsed.netloc.split(":")[0]  # Remove port if present

        return {
            "valid": True,
            "scheme": parsed.scheme,
            "domain": domain,
            "full_url": parsed.geturl(),
            "error": None,
        }

    except Exception as e:
        return {"valid": False, "scheme": None, "domain": None, "error": str(e)}


async def resolve_domain(domain: str) -> dict:
    """
    Resolve a domain to its IP address via DNS lookup.

    Returns:
        dict with keys: resolved, ip, error
    """
    try:
        ip = await asyncio.to_thread(socket.gethostbyname, domain)
        return {"resolved": True, "ip": ip, "error": None}
    except socket.gaierror as e:
        return {"resolved": False, "ip": None, "error": f"DNS resolution failed: {str(e)}"}


async def check_reachability(url: str, timeout: float = 10.0) -> dict:
    """
    Check if a URL is reachable by making an HTTP request.

    Returns:
        dict with keys: reachable, status_code, error
    """
    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=timeout,
            verify=False,  # Allow self-signed certs for reachability check
        ) as client:
            response = await client.head(url)
            return {
                "reachable": True,
                "status_code": response.status_code,
                "error": None,
            }
    except httpx.TimeoutException:
        return {"reachable": False, "status_code": None, "error": "Connection timed out"}
    except httpx.ConnectError:
        return {"reachable": False, "status_code": None, "error": "Connection refused"}
    except Exception as e:
        return {"reachable": False, "status_code": None, "error": str(e)}
