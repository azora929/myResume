import { useState, useCallback } from "react";

const PDF_API = "/api/pdf";
const DEFAULT_ERROR = "Не удалось создать PDF. Попробуйте ещё раз.";
const DEFAULT_FILE_NAME = "Дремин Александр Сергеевич.pdf";

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
      const contentDisposition = response.headers.get("content-disposition") ?? "";
      const utf8FileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
      const plainFileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
      const resolvedFileName = utf8FileNameMatch
        ? decodeURIComponent(utf8FileNameMatch[1])
        : (plainFileNameMatch?.[1] ?? DEFAULT_FILE_NAME);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = resolvedFileName;
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
