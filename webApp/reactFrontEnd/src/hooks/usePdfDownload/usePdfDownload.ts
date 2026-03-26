import { useState, useCallback } from "react";

const PDF_API = "/api/pdf";
const DEFAULT_ERROR = "Не удалось создать PDF. Попробуйте ещё раз.";
const MOBILE_CHROME_RE = /Android|iPhone|iPad|iPod/i;
const CHROME_BRAND_RE = /Chrome|CriOS/i;

function isMobileChromeBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return MOBILE_CHROME_RE.test(ua) && CHROME_BRAND_RE.test(ua);
}

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const handlePdfDownload = useCallback(async () => {
    if (isDownloading) return;
    setDownloadError("");
    setIsDownloading(true);

    try {
      // В мобильном Chrome стабильнее отдавать скачивание напрямую браузеру.
      if (isMobileChromeBrowser()) {
        window.location.href = PDF_API;
        return;
      }

      const response = await fetch(PDF_API);
      if (!response.ok) {
        throw new Error("PDF generation failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      window.setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(url);
      }, 60_000);
    } catch {
      setDownloadError(DEFAULT_ERROR);
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading]);

  return { handlePdfDownload, isDownloading, downloadError };
}
