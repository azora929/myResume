from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from playwright.sync_api import sync_playwright


class PdfRenderHandler:
    def __init__(self, templates_dir: Path | None = None, output_dir: Path | None = None) -> None:
        project_root = Path(__file__).resolve().parents[1]
        self.templates_dir = templates_dir or (project_root / "assets" / "templates")
        self.output_dir = output_dir or (project_root / "tmp")

    def render_random_pdf(self) -> Path:
        template_path = self.templates_dir / "template.html"
        if not template_path.exists():
            raise FileNotFoundError("Шаблон template.html не найден")
        html = template_path.read_text(encoding="utf-8")

        self.output_dir.mkdir(parents=True, exist_ok=True)
        pdf_path = self.output_dir / f"resume_{uuid4().hex}.pdf"

        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.set_content(html, wait_until="load")
            page.pdf(path=str(pdf_path), format="A4", print_background=True)
            browser.close()

        return pdf_path
