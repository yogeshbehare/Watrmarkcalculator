import { NextResponse } from "next/server";
import { analyzeArtwork } from "@/lib/image-analysis";
import { calculateQuote } from "@/lib/pricing";
import { isAllowedArtworkType, isPdfType, UPLOAD_LIMITS } from "@/lib/constants";
import { renderPdfFirstPageToPng } from "@/lib/pdf-render";
import type { AnalyzeResponse } from "@/lib/types";

export const runtime = "nodejs";

function readPositiveNumber(value: FormDataEntryValue | null, label: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${label} must be greater than 0.`);
  }

  return parsed;
}

function readQuantity(value: FormDataEntryValue | null) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const width = readPositiveNumber(formData.get("width"), "Print width");
    const height = readPositiveNumber(formData.get("height"), "Print height");
    const quantity = readQuantity(formData.get("quantity"));
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a JPG, PNG, or PDF artwork file." },
        { status: 400 }
      );
    }

    if (!isAllowedArtworkType(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and PDF artwork files are supported." },
        { status: 400 }
      );
    }

    if (file.size > UPLOAD_LIMITS.maxBytes) {
      return NextResponse.json(
        { error: "Artwork must be 5MB or smaller." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const artworkBuffer = Buffer.from(arrayBuffer);
    const pdfPreviewBuffer = isPdfType(file.type)
      ? await renderPdfFirstPageToPng(artworkBuffer)
      : null;
    const analysisBuffer = pdfPreviewBuffer ?? artworkBuffer;
    const analysis = await analyzeArtwork(analysisBuffer);
    const quote = calculateQuote(
      { width, height, quantity },
      analysis.coveragePercent,
      analysis.billingCoverage
    );

    const response: AnalyzeResponse = {
      analysis,
      quote,
      previewImageUrl: pdfPreviewBuffer
        ? `data:image/png;base64,${pdfPreviewBuffer.toString("base64")}`
        : undefined
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while analysing this artwork.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
