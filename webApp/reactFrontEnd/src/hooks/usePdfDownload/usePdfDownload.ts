import { useState, useCallback } from "react";

const PDF_API = "/api/pdf";
const DEFAULT_ERROR = "Не удалось создать PDF. Попробуйте ещё раз.";

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const handlePdfDownload = useCallback(async () => {
    if (isDownloading) return;
    setDownloadError("");
    setIsDownloading(true);

    try {
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
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError(DEFAULT_ERROR);
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading]);

  return { handlePdfDownload, isDownloading, downloadError };
}
