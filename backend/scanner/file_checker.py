"""
Website file checker.
Checks for the existence of robots.txt and sitemap.xml.
"""

import logging

import httpx

logger = logging.getLogger(__name__)


async def check_robots_txt(base_url: str) -> dict:
    """
    Check if robots.txt exists and fetch a content snippet.

    Args:
        base_url: The base URL of the website (e.g., https://example.com).

    Returns:
        dict with keys: exists, content_snippet
    """
    result = {"exists": False, "content_snippet": None}

    robots_url = f"{base_url.rstrip('/')}/robots.txt"

    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            verify=False,
            follow_redirects=True,
        ) as client:
            response = await client.get(robots_url)

            if response.status_code == 200:
                content_type = response.headers.get("content-type", "")

                # Verify it's actually a text file (not an HTML error page)
                if "text/plain" in content_type or response.text.strip().startswith(("User-agent", "user-agent", "Sitemap", "#")):
                    result["exists"] = True
                    # Get first 500 characters as snippet
                    result["content_snippet"] = response.text[:500]

    except Exception as e:
        logger.warning(f"robots.txt check failed for {base_url}: {str(e)}")

    return result


async def check_sitemap(base_url: str) -> dict:
    """
    Check if sitemap.xml exists.

    Also checks robots.txt for sitemap URL if sitemap.xml is not found
    at the default location.

    Args:
        base_url: The base URL of the website (e.g., https://example.com).

    Returns:
        dict with keys: exists, url
    """
    result = {"exists": False, "url": None}

    sitemap_url = f"{base_url.rstrip('/')}/sitemap.xml"

    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            verify=False,
            follow_redirects=True,
        ) as client:
            response = await client.get(sitemap_url)

            if response.status_code == 200:
                content_type = response.headers.get("content-type", "")
                content = response.text.strip()

                # Verify it's actually XML (not an HTML error page)
                if "xml" in content_type or content.startswith("<?xml") or "<urlset" in content or "<sitemapindex" in content:
                    result["exists"] = True
                    result["url"] = sitemap_url
                    return result

            # If not found at default location, check robots.txt for sitemap directive
            robots_url = f"{base_url.rstrip('/')}/robots.txt"
            response = await client.get(robots_url)

            if response.status_code == 200:
                for line in response.text.splitlines():
                    line_lower = line.strip().lower()
                    if line_lower.startswith("sitemap:"):
                        sitemap_ref = line.strip().split(":", 1)[1].strip()
                        result["exists"] = True
                        result["url"] = sitemap_ref
                        break

    except Exception as e:
        logger.warning(f"Sitemap check failed for {base_url}: {str(e)}")

    return result
