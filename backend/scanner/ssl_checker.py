"""
SSL certificate checker.
Connects to a domain via SSL and extracts certificate details.
"""

import logging
import asyncio
import socket
import ssl
from datetime import datetime, timezone

logger = logging.getLogger(__name__)



def _sync_get_cert(domain: str):
    context = ssl.create_default_context()
    conn = None
    try:
        conn = context.wrap_socket(
            socket.socket(socket.AF_INET),
            server_hostname=domain,
        )
        conn.settimeout(10)
        conn.connect((domain, 443))
        cert = conn.getpeercert()
        return True, cert
    except ssl.SSLCertVerificationError:
        if conn:
            conn.close()
        # Connect without verification
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        conn2 = context.wrap_socket(
            socket.socket(socket.AF_INET),
            server_hostname=domain,
        )
        conn2.settimeout(10)
        conn2.connect((domain, 443))
        # With CERT_NONE we can't get parsed cert details easily via getpeercert()
        # Return invalid status
        return False, None
    finally:
        if conn:
            conn.close()


async def check_ssl(domain: str) -> dict:
    """
    Check SSL certificate details for a domain.

    Connects to port 443 and extracts:
    - Issuer organization
    - Valid from/to dates
    - Days remaining until expiry
    - Overall validity status

    Args:
        domain: The domain name to check.

    Returns:
        dict with keys: issuer, valid_from, valid_to, days_remaining, is_valid
    """
    result = {
        "issuer": None,
        "valid_from": None,
        "valid_to": None,
        "days_remaining": None,
        "is_valid": False,
    }

    try:
        is_valid, cert = await asyncio.to_thread(_sync_get_cert, domain)
        
        if not is_valid:
            return result
            
        result["is_valid"] = True
        
        # Parse certificate details
        if cert:
            # Issuer
            issuer_parts = cert.get("issuer", ())
            for part in issuer_parts:
                for key, value in part:
                    if key == "organizationName":
                        result["issuer"] = value
                        break

            # Valid from
            not_before = cert.get("notBefore")
            if not_before:
                valid_from = datetime.strptime(not_before, "%b %d %H:%M:%S %Y %Z")
                result["valid_from"] = valid_from.strftime("%Y-%m-%d %H:%M:%S")

            # Valid to
            not_after = cert.get("notAfter")
            if not_after:
                valid_to = datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z")
                result["valid_to"] = valid_to.strftime("%Y-%m-%d %H:%M:%S")

                # Days remaining
                now = datetime.now(timezone.utc).replace(tzinfo=None)
                delta = valid_to - now
                result["days_remaining"] = max(0, delta.days)

    except socket.timeout:
        logger.warning(f"SSL check timed out for {domain}")
    except socket.gaierror:
        logger.warning(f"DNS resolution failed for {domain} during SSL check")
    except ConnectionRefusedError:
        logger.warning(f"Connection refused for {domain} on port 443")
    except Exception as e:
        logger.warning(f"SSL check failed for {domain}: {str(e)}")

    return result
