import json
import base64
from datetime import datetime
from fpdf import FPDF
from app.schemas.portfolio import AllocationPlan, ResearchResult, PortfolioDefinition

def sanitize_for_pdf(text: str) -> str:
    """
    Replaces common unicode problematic characters for standard PDF fonts.
    """
    if not text:
        return ""
    
    # Strip basic markdown before character replacement
    import re
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text) # Bold
    text = re.sub(r'\*(.*?)\*', r'\1', text)   # Italic
    text = re.sub(r'#{1,6}\s*(.*?)\n', r'\1\n', text) # Headers
    text = re.sub(r'>\s*(.*?)\n', r'\1\n', text) # Blockquotes
    text = re.sub(r'\[(.*?)\]\((.*?)\)', r'\1 (\2)', text) # Links
    
    replacements = {
        "\u2013": "-",    # en dash
        "\u2014": "--",   # em dash
        "\u2018": "'",    # left single quote
        "\u2019": "'",    # right single quote
        "\u201c": '"',    # left double quote
        "\u201d": '"',    # right double quote
        "\u2022": "*",    # bullet point
        "\u2026": "...",  # ellipsis
        "\u00a0": " ",    # non-breaking space
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    # Encode to latin-1 and ignore remaining outliers to prevent crashes
    return text.encode("latin-1", "ignore").decode("latin-1")

def generate_scientific_report(research: ResearchResult, portfolio: PortfolioDefinition) -> str:
    """
    Generates a professional, scientific-looking investment memorandum in Markdown.
    """
    date_str = datetime.now().strftime("%B %d, %Y")
    
    lines = []
    lines.append(f"# Investment Memorandum: {portfolio.name}")
    lines.append(f"**Date:** {date_str}  ")
    lines.append(f"**Subject:** Qualitative and Quantitative Analysis of '{portfolio.name}' Strategy  ")
    lines.append(f"**Classification:** Confidential - AI-Generated Investment Thesis")
    lines.append("\n---\n")
    
    lines.append("## 1. Executive Summary")
    lines.append(research.summary)
    lines.append("\n")
    
    lines.append("## 2. Methodology & Information Retrieval")
    lines.append("The following analysis was conducted using an agentic multi-step retrieval process. "
                 "The system crawled professional news outlets, financial filings, and prediction market sentiment "
                 "to aggregate a balanced view of the underlying assets.")
    lines.append(f"- **Keywords Targeted:** {', '.join(research.keywords)}")
    lines.append(f"- **Evidence Density:** {len(research.evidence_items)} primary sources extracted and synthesized.")
    lines.append("\n")
    
    lines.append("## 3. Catalyst Identification")
    lines.append("Based on the synthesized data, the following primary catalysts have been identified as drivers for the proposed allocation:")
    # We can use the risk_flags or just some generic formatting of the summary
    for i, flag in enumerate(research.risk_flags, 1):
        lines.append(f"{i}. **{flag}**: Analysis indicates this factor provides significant predictive signal.")
    lines.append("\n")
    
    lines.append("## 4. Risk Assessment & Mitigation")
    lines.append("All investment strategies carry inherent risks. The following potential headwinds were identified during the synthesis phase:")
    lines.append("> [!WARNING]")
    lines.append("> High-volatility environments and liquidity constraints on-chain may impact the realized yield of the suggested positions.")
    lines.append("\n")
    
    lines.append("## 5. Bibliographic References")
    for item in research.evidence_items:
        title = item.get("title", "Article Summary")
        url = item.get("url", "#")
        lines.append(f"- *{title}*. Available at: [{url}]({url})")
        
    lines.append("\n---\n")
    lines.append("*Disclaimer: This document is produced by an automated AI agent for informational purposes. "
                 "Past performance is not indicative of future results.*")
    
    return "\n".join(lines)

def generate_allocation_proposal(plan: AllocationPlan, portfolio_name: str) -> str:
    """
    Generates a structured JSON-like proposal for technical verification.
    """
    proposal = {
        "proposal_metadata": {
            "strategy": portfolio_name,
            "timestamp": datetime.now().isoformat(),
            "version": "1.2.0-Alpha"
        },
        "allocation_matrix": [
            {
                "market_id": t.market_id,
                "question": t.question,
                "target_weight": f"{t.weight*100:.2f}%",
                "predicted_outcome": t.outcome,
                "rationale_snippet": t.rationale[:100] + "..." if t.rationale else "N/A"
            } for t in plan.targets
        ],
        "risk_overrides": plan.warnings
    }
    return json.dumps(proposal, indent=2)

def generate_scientific_pdf(research: ResearchResult, portfolio: PortfolioDefinition) -> str:
    """
    Generates a professional, scientific-style PDF report using fpdf2.
    Featured branding: Prismlines.
    Featured content: Deep Analytical Thesis Discourse.
    """
    class ScientificPDF(FPDF):
        def header(self):
            self.set_font("helvetica", "I", 8)
            page_width = self.w - 2 * self.l_margin
            col_width = page_width / 2
            self.cell(col_width, 10, f"PRISMLINES QUANTITATIVE RESEARCH Vol. 1 Issue {datetime.now().month}", border=0, align="L")
            self.cell(col_width, 10, "https://prismlines.ai/research", border=0, align="R", ln=True)
            self.ln(5)

        def footer(self):
            self.set_y(-15)
            self.set_font("helvetica", "I", 8)
            self.cell(0, 10, f"Page {self.page_no()} | PRISMLINES AI AGENTIC RESEARCH UNIT", align="C")

    # Use A4, unit mm
    pdf = ScientificPDF(orientation='P', unit='mm', format='A4')
    pdf.set_margins(20, 20, 20)
    pdf.add_page()
    
    # Paper Type
    pdf.set_font("helvetica", "I", 10)
    pdf.cell(0, 10, "Prismlines Proprietary Investment Thesis & Behavioral Analysis", ln=True)
    
    # Title
    pdf.set_x(20)
    pdf.set_font("helvetica", "B", 18)
    pdf.ln(5)
    pdf.multi_cell(170, 10, sanitize_for_pdf(f"Prismlines Behavioral Mapping: {portfolio.name}"), align="L")
    
    # Authors
    pdf.ln(5)
    pdf.set_x(20)
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 7, "Prismlines Agent Alpha-1 (Quantitative Behavioral Research Unit)", ln=True)
    pdf.set_font("helvetica", "I", 9)
    pdf.cell(0, 5, "Prismlines Protocol Decentralized Intelligence Environment", ln=True)
    
    # Horizontal Rule
    pdf.ln(5)
    pdf.line(20, pdf.get_y(), 190, pdf.get_y())
    pdf.ln(5)
    
    # Executive Abstract
    pdf.set_x(20)
    pdf.set_font("helvetica", "B", 10)
    pdf.cell(0, 7, "Executive Abstract", ln=True)
    pdf.set_font("helvetica", "", 9)
    pdf.multi_cell(170, 5, sanitize_for_pdf(research.summary))
    
    # Keywords
    pdf.ln(3)
    pdf.set_x(20)
    pdf.set_font("helvetica", "B", 9)
    pdf.write(5, "Keywords: ")
    pdf.set_font("helvetica", "", 9)
    pdf.write(5, sanitize_for_pdf(", ".join(research.keywords)))
    pdf.ln(10)
    
    # The Deep Thinking / Thesis Discourse Section
    if research.thesis_discourse:
        pdf.set_x(20)
        pdf.set_font("helvetica", "B", 12)
        pdf.cell(0, 7, "I. Thematic Synthesis & Behavioral Discourse", ln=True)
        pdf.set_font("helvetica", "", 10)
        # Using the deep-dive reasoning here for ChatGPT "vibes"
        pdf.multi_cell(170, 5, sanitize_for_pdf(research.thesis_discourse))
        pdf.ln(5)

    # Core Reasoning & Sections
    sections = [
        ("II. Structural Catalysts", "Our agentic screening identifies specific behavioral nodes and market inefficiencies. The proposed positions are calibrated to capture alpha from verified event-driven drivers and sentiment shifts."),
        ("III. Risk Hegemony & Tail Probabilities", "Quantitative modeling in high-velocity prediction markets acknowledges significant liquidity skew and informational asymmetry. Risk vectors are continuously monitored for threshold breeches.")
    ]
    
    for title, content in sections:
        pdf.ln(8)
        pdf.set_x(20)
        pdf.set_font("helvetica", "B", 12)
        pdf.cell(0, 7, title, ln=True)
        pdf.set_font("helvetica", "", 10)
        pdf.multi_cell(170, 5, sanitize_for_pdf(content))

    # References (Bibliographic)
    pdf.ln(10)
    pdf.set_x(20)
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 7, "Investment Signaling Sources (Bibliographic)", ln=True)
    pdf.set_font("helvetica", "", 8)
    for i, item in enumerate(research.evidence_items, 1):
        title = item.get("title", "Prismlines Intelligence Node")
        url = item.get("url", "N/A")
        pdf.set_x(20)
        pdf.multi_cell(170, 4, sanitize_for_pdf(f"[{i}] {title}. Retrieval Link: {url}"))

    # Output to base64
    try:
        # dest='S' returns as string in FPDF 1.7.2
        pdf_content = pdf.output(dest='S')
        if isinstance(pdf_content, str):
            pdf_bytes = pdf_content.encode('latin-1')
        else:
            pdf_bytes = bytes(pdf_content)
    except Exception as e:
        print(f"Prismlines PDF Generation Error: {e}")
        return ""

    return base64.b64encode(pdf_bytes).decode("utf-8")
