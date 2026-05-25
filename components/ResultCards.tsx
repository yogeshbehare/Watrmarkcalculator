"use client";

import Image from "next/image";
import {
  ImageUp,
  MessageCircle,
  Package,
  ReceiptText,
  Ruler
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { AnalyzeResponse } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/utils/format";
import { buildWhatsAppQuoteMessage, buildWhatsAppQuoteUrl } from "@/utils/whatsapp";

type ResultCardsProps = {
  result: AnalyzeResponse;
  artworkFile: File | null;
  adminMode: boolean;
};

function DetailRow({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-brand-line bg-white p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-orange">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
          {label}
        </p>
        <p className="mt-1 text-base font-bold text-brand-ink">{value}</p>
      </div>
    </div>
  );
}

function AdminRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brand-line py-3 last:border-b-0">
      <dt className="text-sm text-brand-muted">{label}</dt>
      <dd className="text-right text-sm font-bold text-brand-ink">{value}</dd>
    </div>
  );
}

export function ResultCards({ result, artworkFile, adminMode }: ResultCardsProps) {
  const { quote, analysis } = result;
  const whatsAppUrl = buildWhatsAppQuoteUrl(quote);
  const [canShareArtwork, setCanShareArtwork] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!artworkFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(artworkFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [artworkFile]);

  useEffect(() => {
    if (
      artworkFile &&
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      "canShare" in navigator &&
      navigator.canShare({ files: [artworkFile] })
    ) {
      setCanShareArtwork(true);
      return;
    }

    setCanShareArtwork(false);
  }, [artworkFile]);

  async function handleShareArtwork() {
    if (!artworkFile) return;

    try {
      await navigator.share({
        title: "Watrmark Print Quote",
        text: buildWhatsAppQuoteMessage(quote),
        files: [artworkFile]
      });
    } catch {
      // User cancelled or the device rejected file sharing. The WhatsApp quote link remains available.
    }
  }

  return (
    <section className="grid gap-5">
      <div className="animate-rise overflow-hidden rounded-lg border border-brand-line bg-white shadow-premium">
        {previewUrl ? (
          <div className="border-b border-brand-line bg-neutral-50 p-4">
            <div className="relative mx-auto aspect-[4/3] max-h-72 w-full overflow-hidden rounded-lg bg-white">
              <Image
                src={previewUrl}
                alt="Uploaded artwork preview"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        ) : null}

        <div className="p-5 sm:p-7">
          <div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                Watrmark Print Quote
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-normal text-brand-ink sm:text-3xl">
                Instant order estimate
              </h2>
            </div>
          </div>

          <div className="mt-7 rounded-lg bg-brand-soft p-5">
            <p className="text-sm font-semibold text-brand-muted">Final Unit Price</p>
            <p className="mt-2 text-4xl font-black tracking-normal text-brand-ink sm:text-5xl">
              {formatCurrency(quote.pricePerUnit)}
              <span className="ml-2 text-base font-bold text-brand-muted">/ piece</span>
            </p>
            <div className="mt-5 border-t border-orange-200 pt-5">
              <p className="text-sm font-semibold text-brand-muted">Total Order Value</p>
              <p className="mt-1 text-3xl font-black text-brand-orange">
                {formatCurrency(quote.totalOrderValue)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailRow
              label="Print Size"
              value={`${quote.width} × ${quote.height} inches`}
              icon={<Ruler className="h-5 w-5" />}
            />
            <DetailRow
              label="Quantity"
              value={`${formatNumber(quote.quantity, 0)} pcs`}
              icon={<Package className="h-5 w-5" />}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-md bg-brand-orange px-5 py-3 text-sm font-bold text-white shadow-card transition hover:bg-brand-orangeDark sm:w-auto"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Quote on WhatsApp
            </a>

            {canShareArtwork ? (
              <button
                type="button"
                onClick={handleShareArtwork}
                className="inline-flex w-full items-center justify-center rounded-md border border-brand-line bg-white px-5 py-3 text-sm font-bold text-brand-ink transition hover:border-brand-orange hover:text-brand-orange sm:w-auto"
              >
                <ImageUp className="mr-2 h-4 w-4" />
                Share Artwork
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {adminMode ? (
        <div className="rounded-lg border border-brand-line bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-brand-orange">
            <ReceiptText className="h-5 w-5" />
            <h3 className="text-base font-bold text-brand-ink">Internal Admin Details</h3>
          </div>
          <dl>
            <AdminRow label="Estimated coverage" value={`${quote.coveragePercent.toFixed(2)}%`} />
            <AdminRow label="Average CMYK density" value={analysis.averageInkDensity.toFixed(4)} />
            <AdminRow label="Billing coverage" value={`${quote.billingCoverage}%`} />
            <AdminRow label="Quantity slab" value={quote.internal.quantitySlab.label} />
            <AdminRow label="Quantity multiplier" value={`${quote.internal.quantityMultiplier}×`} />
            <AdminRow
              label="Ink cost per unit"
              value={formatCurrency(quote.internal.inkCostPerUnit)}
            />
            <AdminRow
              label="Base production cost"
              value={formatCurrency(quote.internal.baseProductionCostPerUnit)}
            />
            <AdminRow
              label="Raw cost per unit"
              value={formatCurrency(quote.internal.rawCostPerUnit)}
            />
            <AdminRow label="Profit margin" value={`${quote.internal.profitMargin * 100}%`} />
            <AdminRow
              label="Final before minimum"
              value={formatCurrency(quote.internal.finalCostBeforeMinimum)}
            />
            <AdminRow label="Price per sq.inch" value={formatCurrency(quote.pricePerSqInch)} />
            <AdminRow label="Printable pixels" value={formatNumber(analysis.printablePixels, 0)} />
            <AdminRow
              label="White pixels removed"
              value={formatNumber(analysis.ignoredWhitePixels, 0)}
            />
          </dl>
        </div>
      ) : null}
    </section>
  );
}
