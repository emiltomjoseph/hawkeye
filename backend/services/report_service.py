"""
Report service layer.
Generates downloadable PDF security reports using fpdf2.
"""

import io
from datetime import datetime, timezone

from fpdf import FPDF

from models.scan import Scan
from models.scan_result import ScanResult


def _get_grade(score: int) -> str:
    """Convert numeric score to letter grade."""
    if score >= 90:
        return "A+"
    elif score >= 80:
        return "A"
    elif score >= 70:
        return "B"
    elif score >= 60:
        return "C"
    elif score >= 50:
        return "D"
    else:
        return "F"


def _get_grade_color(score: int) -> tuple:
    """Get RGB color for score grade."""
    if score >= 80:
        return (46, 204, 113)     # Green
    elif score >= 60:
        return (241, 196, 15)     # Yellow
    elif score >= 40:
        return (230, 126, 34)     # Orange
    else:
        return (231, 76, 60)      # Red


def generate_pdf_report(scan: Scan, result: ScanResult) -> bytes:
    """
    Generate a comprehensive PDF security report.

    Args:
        scan: The Scan object with metadata.
        result: The ScanResult object with detailed findings.

    Returns:
        PDF content as bytes.
    """
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # --- Header ---
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(0, 15, "HawkEye Security Report", ln=True, align="C")
    pdf.ln(5)

    # Divider line
    pdf.set_draw_color(52, 152, 219)
    pdf.set_line_width(1)
    pdf.line(20, pdf.get_y(), 190, pdf.get_y())
    pdf.ln(10)

    # --- Scan Information ---
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(0, 10, "Scan Information", ln=True)
    pdf.ln(3)

    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(52, 73, 94)
    pdf.cell(40, 8, "URL:", ln=False)
    pdf.set_text_color(41, 128, 185)
    pdf.cell(0, 8, str(scan.url), ln=True)

    pdf.set_text_color(52, 73, 94)
    pdf.cell(40, 8, "Scan Date:", ln=False)
    scan_date = scan.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if scan.created_at else "N/A"
    pdf.cell(0, 8, scan_date, ln=True)

    pdf.cell(40, 8, "Status:", ln=False)
    pdf.cell(0, 8, scan.status.upper(), ln=True)
    pdf.ln(5)

    # --- Security Score ---
    score = scan.security_score or 0
    grade = _get_grade(score)
    grade_color = _get_grade_color(score)

    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(0, 10, "Security Score", ln=True)
    pdf.ln(3)

    pdf.set_font("Helvetica", "B", 36)
    pdf.set_text_color(*grade_color)
    pdf.cell(50, 20, f"{score}/100", ln=False)
    pdf.set_font("Helvetica", "B", 24)
    pdf.cell(0, 20, f"Grade: {grade}", ln=True)
    pdf.ln(5)

    # --- HTTPS Status ---
    if result.https_status:
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(44, 62, 80)
        pdf.cell(0, 10, "HTTPS Status", ln=True)
        pdf.ln(3)

        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(52, 73, 94)
        https = result.https_status
        _add_check_row(pdf, "HTTPS Available", https.get("available", False))
        _add_check_row(pdf, "HTTP to HTTPS Redirect", https.get("redirect", False))
        _add_check_row(pdf, "HSTS Enabled", https.get("hsts", False))
        pdf.ln(5)

    # --- SSL Details ---
    if result.ssl_details:
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(44, 62, 80)
        pdf.cell(0, 10, "SSL Certificate", ln=True)
        pdf.ln(3)

        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(52, 73, 94)
        ssl = result.ssl_details
        pdf.cell(50, 7, "Issuer:", ln=False)
        pdf.cell(0, 7, str(ssl.get("issuer", "N/A")), ln=True)
        pdf.cell(50, 7, "Valid From:", ln=False)
        pdf.cell(0, 7, str(ssl.get("valid_from", "N/A")), ln=True)
        pdf.cell(50, 7, "Valid To:", ln=False)
        pdf.cell(0, 7, str(ssl.get("valid_to", "N/A")), ln=True)
        pdf.cell(50, 7, "Days Remaining:", ln=False)
        pdf.cell(0, 7, str(ssl.get("days_remaining", "N/A")), ln=True)
        _add_check_row(pdf, "Certificate Valid", ssl.get("is_valid", False))
        pdf.ln(5)

    # --- Security Headers ---
    if result.security_headers:
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(44, 62, 80)
        pdf.cell(0, 10, "Security Headers", ln=True)
        pdf.ln(3)

        pdf.set_font("Helvetica", "", 11)
        for header_name, header_info in result.security_headers.items():
            present = header_info.get("present", False) if isinstance(header_info, dict) else False
            _add_check_row(pdf, header_name, present)
        pdf.ln(5)

    # --- Cookie Security ---
    if result.cookies:
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(44, 62, 80)
        pdf.cell(0, 10, "Cookie Security", ln=True)
        pdf.ln(3)

        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(52, 73, 94)

        if len(result.cookies) == 0:
            pdf.cell(0, 7, "No cookies detected.", ln=True)
        else:
            # Table header
            pdf.set_font("Helvetica", "B", 10)
            pdf.cell(60, 7, "Cookie Name", border=1)
            pdf.cell(25, 7, "Secure", border=1, align="C")
            pdf.cell(25, 7, "HttpOnly", border=1, align="C")
            pdf.cell(30, 7, "SameSite", border=1, align="C")
            pdf.ln()

            pdf.set_font("Helvetica", "", 10)
            for cookie in result.cookies[:20]:  # Limit to 20 cookies
                name = str(cookie.get("name", "Unknown"))[:30]
                pdf.cell(60, 7, name, border=1)
                pdf.cell(25, 7, _yes_no(cookie.get("secure")), border=1, align="C")
                pdf.cell(25, 7, _yes_no(cookie.get("httponly")), border=1, align="C")
                pdf.cell(30, 7, str(cookie.get("samesite", "None")), border=1, align="C")
                pdf.ln()
        pdf.ln(5)

    # --- Technology Stack ---
    if result.technologies:
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(44, 62, 80)
        pdf.cell(0, 10, "Detected Technologies", ln=True)
        pdf.ln(3)

        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(52, 73, 94)
        for tech in result.technologies:
            pdf.cell(5)
            pdf.cell(0, 7, f"  * {tech}", ln=True)
        pdf.ln(5)

    # --- Recommendations ---
    if result.recommendations:
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(44, 62, 80)
        pdf.cell(0, 10, "Recommendations", ln=True)
        pdf.ln(3)

        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(52, 73, 94)
        for i, rec in enumerate(result.recommendations, 1):
            pdf.cell(5)
            pdf.multi_cell(0, 7, f"{i}. {rec}")
            pdf.ln(2)

    # --- Footer ---
    pdf.ln(10)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(149, 165, 166)
    pdf.cell(0, 8, f"Generated by HawkEye Security Platform | {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}", ln=True, align="C")
    pdf.cell(0, 8, "This report is for informational purposes only.", ln=True, align="C")

    # Output as bytes
    return pdf.output()


def _add_check_row(pdf: FPDF, label: str, passed: bool):
    """Add a pass/fail check row to the PDF."""
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(52, 73, 94)
    pdf.cell(80, 7, f"  {label}:", ln=False)

    if passed:
        pdf.set_text_color(46, 204, 113)
        pdf.cell(0, 7, "PASS", ln=True)
    else:
        pdf.set_text_color(231, 76, 60)
        pdf.cell(0, 7, "FAIL", ln=True)

    pdf.set_text_color(52, 73, 94)


def _yes_no(value) -> str:
    """Convert boolean to Yes/No string."""
    if value is True:
        return "Yes"
    elif value is False:
        return "No"
    return "N/A"
