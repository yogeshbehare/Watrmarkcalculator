"use client";

import { ImageUp, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { UPLOAD_LIMITS } from "@/lib/constants";

type UploadDropzoneProps = {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
};

export function UploadDropzone({ file, onChange, disabled }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isPdf = file?.type === "application/pdf";

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (!isPdf) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    let isMounted = true;
    const selectedFile = file;

    async function renderPdfPreview() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
        const pdfDocument = await pdfjs.getDocument({
          data: new Uint8Array(await selectedFile.arrayBuffer())
        }).promise;
        const page = await pdfDocument.getPage(1);
        const initialViewport = page.getViewport({ scale: 1 });
        const longestSide = Math.max(initialViewport.width, initialViewport.height);
        const viewport = page.getViewport({ scale: Math.min(1.5, 700 / longestSide) });
        const canvas = window.document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not available.");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/png");

        if (isMounted) {
          setPreviewUrl(dataUrl);
        }

        await pdfDocument.cleanup();
      } catch {
        if (isMounted) {
          setPreviewUrl(null);
        }
      }
    }

    renderPdfPreview();

    return () => {
      isMounted = false;
    };
  }, [file, isPdf]);

  const acceptFile = useCallback(
    (incoming: File | undefined) => {
      if (!incoming) return;
      onChange(incoming);
    },
    [onChange]
  );

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-brand-ink">
        Upload artwork
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled) acceptFile(event.dataTransfer.files[0]);
        }}
        className={[
          "relative flex min-h-56 items-center justify-center rounded-lg border border-dashed bg-white p-5 transition",
          isDragging
            ? "border-brand-orange bg-brand-soft shadow-card"
            : "border-brand-line hover:border-brand-orange/70",
          disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
        ].join(" ")}
      >
        <input
          type="file"
          accept={UPLOAD_LIMITS.allowedTypes.join(",")}
          disabled={disabled}
          onChange={(event) => acceptFile(event.target.files?.[0])}
          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          aria-label="Upload JPG, PNG, or PDF artwork"
        />

        {file ? (
          <div className="grid w-full gap-4 text-center">
            {isPdf && !previewUrl ? (
              <div className="mx-auto grid h-36 w-full max-w-xs place-items-center rounded-md border border-brand-line bg-brand-soft text-brand-orange">
                <div>
                  <ImageUp className="mx-auto h-8 w-8" />
                  <p className="mt-2 text-sm font-bold">PDF artwork</p>
                  <p className="mt-1 text-xs text-brand-muted">First page will be analysed</p>
                </div>
              </div>
            ) : previewUrl ? (
              <Image
                src={previewUrl}
                alt="Artwork preview"
                width={640}
                height={320}
                unoptimized
                className="mx-auto max-h-40 max-w-full rounded-md border border-brand-line object-contain"
              />
            ) : null}
            <div>
              <p className="text-sm font-semibold text-brand-ink">{file.name}</p>
              <p className="mt-1 text-xs text-brand-muted">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onChange(null);
              }}
              className="mx-auto inline-flex items-center gap-2 rounded-md border border-brand-line px-3 py-2 text-sm font-semibold text-brand-ink transition hover:border-brand-orange hover:text-brand-orange"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-brand-soft text-brand-orange">
              <ImageUp className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-ink">
              Drag and drop your PNG, JPG, or PDF
            </p>
            <p className="mt-1 text-xs text-brand-muted">
              Maximum file size: 5MB. PDFs use page 1.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
