import sharp from "sharp";
import { UPLOAD_LIMITS } from "@/lib/constants";
import { mapCoverageToBillingTier } from "@/lib/pricing";
import type { ArtworkAnalysis } from "@/lib/types";

type RgbaPixel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function rgbToCmykDensity({ r, g, b }: RgbaPixel) {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;

  const k = 1 - Math.max(r1, g1, b1);

  if (k === 1) {
    return 0.25;
  }

  const c = (1 - r1 - k) / (1 - k);
  const m = (1 - g1 - k) / (1 - k);
  const y = (1 - b1 - k) / (1 - k);

  return (c + m + y + k) / 4;
}

export async function analyzeArtwork(buffer: Buffer): Promise<ArtworkAnalysis> {
  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Unable to read image dimensions.");
  }

  const shouldResize =
    Math.max(metadata.width, metadata.height) > UPLOAD_LIMITS.maxAnalysisDimension;

  // Resize before reading raw pixels so uploaded production artwork stays fast to analyse.
  const pipeline = image
    .resize({
      width: shouldResize ? UPLOAD_LIMITS.maxAnalysisDimension : undefined,
      height: shouldResize ? UPLOAD_LIMITS.maxAnalysisDimension : undefined,
      fit: "inside",
      withoutEnlargement: true
    })
    .ensureAlpha()
    .raw();

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  let totalInkDensity = 0;
  let printablePixels = 0;
  let ignoredWhitePixels = 0;
  let ignoredTransparentPixels = 0;

  for (let index = 0; index < data.length; index += 4) {
    const pixel: RgbaPixel = {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3]
    };

    if (pixel.a === 0) {
      ignoredTransparentPixels += 1;
      continue;
    }

    const brightness = (pixel.r + pixel.g + pixel.b) / 3;

    // Near-white pixels behave as background for print costing and are excluded.
    if (brightness > 245) {
      ignoredWhitePixels += 1;
      continue;
    }

    printablePixels += 1;
    totalInkDensity += rgbToCmykDensity(pixel);
  }

  const analyzedPixels = info.width * info.height;
  // Coverage is total simulated CMYK density over the full sampled canvas.
  const coveragePercent =
    analyzedPixels > 0 ? (totalInkDensity / analyzedPixels) * 100 : 0;
  const normalizedCoverage = Number(coveragePercent.toFixed(2));

  return {
    coveragePercent: normalizedCoverage,
    billingCoverage: mapCoverageToBillingTier(normalizedCoverage),
    printablePixels,
    analyzedPixels,
    ignoredWhitePixels,
    ignoredTransparentPixels,
    resizedWidth: info.width,
    resizedHeight: info.height
  };
}
