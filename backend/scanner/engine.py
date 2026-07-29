"""
Scanner engine orchestrator.
Runs all security checks and aggregates results.
"""

import logging
from urllib.parse import urlparse

from scanner.url_validator import validate_url_format, resolve_domain
from scanner.https_checker import check_https
from scanner.ssl_checker import check_ssl
from scanner.header_checker import check_security_headers
from scanner.cookie_checker import check_cookies
from scanner.file_checker import check_robots_txt, check_sitemap
from scanner.tech_detector import detect_technologies
from scanner.scorer import calculate_score
from scanner.recommender import generate_recommendations

logger = logging.getLogger(__name__)


async def run_scan(url: str) -> dict:
    """
    Execute a full security scan on the given URL.

    Steps:
    1. Validate and normalize the URL
    2. Resolve the domain
    3. Run all security checks in sequence
    4. Calculate the security score
    5. Generate recommendations

    Args:
        url: The target URL to scan.

    Returns:
        dict with all scan results, score, and recommendations.

    Raises:
        ValueError: If the URL is invalid or unreachable.
    """
    # 1. Validate URL
    url_str = str(url)
    url_info = validate_url_format(url_str)

    if not url_info["valid"]:
        raise ValueError(f"Invalid URL: {url_info['error']}")

    domain = url_info["domain"]
    full_url = url_info.get("full_url", url_str)

    # Ensure we have an HTTPS URL for scanning
    if not full_url.startswith("https://"):
        full_url = f"https://{domain}"

    base_url = f"https://{domain}"

    # 2. Resolve domain
    dns_result = await resolve_domain(domain)
    if not dns_result["resolved"]:
        raise ValueError(f"Cannot resolve domain: {dns_result['error']}")

    logger.info(f"Scanning {domain} (IP: {dns_result['ip']})")

    # 3. Run all security checks
    https_status = await check_https(domain)
    ssl_details = await check_ssl(domain)
    security_headers = await check_security_headers(full_url)
    cookies = await check_cookies(full_url)
    robots_txt = await check_robots_txt(base_url)
    sitemap = await check_sitemap(base_url)
    technologies = await detect_technologies(full_url)

    # 4. Calculate score
    security_score = calculate_score(
        https_status=https_status,
        ssl_details=ssl_details,
        security_headers=security_headers,
        cookies=cookies,
        robots_txt=robots_txt,
        sitemap=sitemap,
        technologies=technologies,
    )

    # 5. Generate recommendations
    recommendations = generate_recommendations(
        https_status=https_status,
        ssl_details=ssl_details,
        security_headers=security_headers,
        cookies=cookies,
        robots_txt=robots_txt,
        sitemap=sitemap,
    )

    return {
        "https_status": https_status,
        "ssl_details": ssl_details,
        "security_headers": security_headers,
        "cookies": cookies,
        "robots_txt": robots_txt,
        "sitemap": sitemap,
        "technologies": technologies,
        "security_score": security_score,
        "recommendations": recommendations,
    }
