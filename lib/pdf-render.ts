import { createCanvas } from "@napi-rs/canvas";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type PdfPageViewport = {
  width: number;
  height: number;
};

type PdfPage = {
  getViewport: (options: { scale: number }) => PdfPageViewport;
  render: (options: {
    canvasContext: ReturnType<typeof createCanvas>["getContext"] extends (
      context: "2d"
    ) => infer Context
      ? Context
      : never;
    viewport: PdfPageViewport;
  }) => {
    promise: Promise<void>;
  };
};

type PdfDocument = {
  getPage: (pageNumber: number) => Promise<PdfPage>;
  cleanup?: () => Promise<void>;
  destroy?: () => Promise<void>;
};

type PdfJsModule = {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument: (options: {
    data: Uint8Array;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
    disableFontFace?: boolean;
  }) => {
    promise: Promise<PdfDocument>;
  };
};

export async function renderPdfFirstPageToPng(buffer: Buffer) {
  const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as unknown as PdfJsModule;
  const workerPath = path.join(process.cwd(), "public", "pdf.worker.mjs");

  if (existsSync(workerPath)) {
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  }

  const document = await pdfjs
    .getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      disableFontFace: true
    })
    .promise;

  try {
    const page = await document.getPage(1);
    const initialViewport = page.getViewport({ scale: 1 });
    const longestSide = Math.max(initialViewport.width, initialViewport.height);
    const scale = Math.min(2, 1200 / longestSide);
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    return canvas.toBuffer("image/png");
  } finally {
    await document.cleanup?.();
    await document.destroy?.();
  }
}
