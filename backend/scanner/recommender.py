"""
Security recommendation engine.
Generates human-readable recommendations based on scan findings.
"""

import logging
from typing import List

logger = logging.getLogger(__name__)


def generate_recommendations(
    https_status: dict,
    ssl_details: dict,
    security_headers: dict,
    cookies: list,
    robots_txt: dict,
    sitemap: dict,
) -> List[str]:
    """
    Generate actionable security recommendations based on failed checks.

    Args:
        https_status: Result from HTTPS checker.
        ssl_details: Result from SSL checker.
        security_headers: Result from header checker.
        cookies: Result from cookie checker.
        robots_txt: Result from robots.txt checker.
        sitemap: Result from sitemap checker.

    Returns:
        List of recommendation strings.
    """
    recommendations = []

    # HTTPS recommendations
    if not https_status.get("available"):
        recommendations.append(
            "Enable HTTPS on your website. HTTPS encrypts data in transit and is essential for security and SEO."
        )
    if https_status.get("available") and not https_status.get("redirect"):
        recommendations.append(
            "Configure HTTP to HTTPS redirect. Ensure all HTTP traffic is automatically redirected to HTTPS."
        )
    if not https_status.get("hsts"):
        recommendations.append(
            "Enable HSTS (HTTP Strict Transport Security) header to prevent protocol downgrade attacks."
        )

    # SSL recommendations
    if not ssl_details.get("is_valid"):
        recommendations.append(
            "Fix your SSL certificate. The current certificate is invalid or not trusted by browsers."
        )
    days = ssl_details.get("days_remaining")
    if days is not None and days <= 30:
        recommendations.append(
            f"Renew your SSL certificate. It expires in {days} days."
        )

    # Security header recommendations
    header_recommendations = {
        "Content-Security-Policy": "Add a Content-Security-Policy (CSP) header to prevent XSS and injection attacks.",
        "Strict-Transport-Security": "Add Strict-Transport-Security header with a long max-age to enforce HTTPS.",
        "X-Frame-Options": "Add X-Frame-Options header (DENY or SAMEORIGIN) to prevent clickjacking attacks.",
        "X-Content-Type-Options": "Add X-Content-Type-Options: nosniff header to prevent MIME type sniffing.",
        "Referrer-Policy": "Add a Referrer-Policy header to control information sent in the Referer header.",
        "Permissions-Policy": "Add a Permissions-Policy header to control which browser features can be used.",
    }

    for header_name, rec_text in header_recommendations.items():
        header_info = security_headers.get(header_name, {})
        if isinstance(header_info, dict) and not header_info.get("present"):
            recommendations.append(rec_text)

    # Cookie recommendations
    if cookies:
        insecure_cookies = [c for c in cookies if not c.get("secure")]
        no_httponly = [c for c in cookies if not c.get("httponly")]
        no_samesite = [c for c in cookies if c.get("samesite", "Not Set") == "Not Set"]

        if insecure_cookies:
            names = ", ".join(c.get("name", "unknown") for c in insecure_cookies[:3])
            recommendations.append(
                f"Set the Secure flag on cookies ({names}) to ensure they are only sent over HTTPS."
            )
        if no_httponly:
            names = ", ".join(c.get("name", "unknown") for c in no_httponly[:3])
            recommendations.append(
                f"Set the HttpOnly flag on cookies ({names}) to prevent JavaScript access."
            )
        if no_samesite:
            recommendations.append(
                "Set the SameSite attribute on cookies to prevent CSRF attacks."
            )

    # Website file recommendations
    if not robots_txt.get("exists"):
        recommendations.append(
            "Add a robots.txt file to control search engine crawling behavior."
        )
    if not sitemap.get("exists"):
        recommendations.append(
            "Add a sitemap.xml file to help search engines discover and index your pages."
        )

    return recommendations
