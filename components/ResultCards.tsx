import { BadgeCheck, Layers, Palette, ReceiptText, Ruler, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { AnalyzeResponse } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/utils/format";
import { buildWhatsAppQuoteUrl } from "@/utils/whatsapp";

type ResultCardsProps = {
  result: AnalyzeResponse;
};

function MetricCard({
  label,
  value,
  helper,
  icon
}: {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <div className="animate-rise rounded-lg border border-brand-line bg-white p-5 shadow-card">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-orange">
        {icon}
      </div>
      <p className="text-sm font-medium text-brand-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-normal text-brand-ink">{value}</p>
      <p className="mt-2 text-xs leading-5 text-brand-muted">{helper}</p>
    </div>
  );
}

export function ResultCards({ result }: ResultCardsProps) {
  const { quote, analysis } = result;
  const whatsAppUrl = buildWhatsAppQuoteUrl(quote);

  return (
    <section className="grid gap-5">
      <div className="rounded-lg border border-brand-line bg-white p-5 shadow-premium">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
              Quote ready
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-normal text-brand-ink">
              Estimated print order value
            </h2>
          </div>
          {quote.minimumRateApplied ? (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-3 py-2 text-sm font-semibold text-brand-orange">
              <BadgeCheck className="h-4 w-4" />
              Minimum Rate Applied
            </span>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MetricCard
            label="Estimated coverage"
            value={`${quote.coveragePercent.toFixed(2)}%`}
            helper={`${formatNumber(analysis.printablePixels, 0)} printable pixels analysed`}
            icon={<Palette className="h-5 w-5" />}
          />
          <MetricCard
            label="Billing tier used"
            value={`${quote.billingCoverage}%`}
            helper="Coverage is rounded to billing slabs for practical ink costing"
            icon={<Layers className="h-5 w-5" />}
          />
          <MetricCard
            label="Price per unit"
            value={formatCurrency(quote.pricePerUnit)}
            helper={`${formatCurrency(quote.pricePerSqInch)} per sq.inch`}
            icon={<ReceiptText className="h-5 w-5" />}
          />
          <MetricCard
            label="Total print area"
            value={`${formatNumber(quote.totalArea)} sq.in`}
            helper={`${formatNumber(quote.unitArea)} sq.in per unit × ${quote.quantity} units`}
            icon={<Ruler className="h-5 w-5" />}
          />
          <MetricCard
            label="Total order value"
            value={formatCurrency(quote.totalOrderValue)}
            helper="Calculated from coverage, print area, overhead, and margin"
            icon={<Sparkles className="h-5 w-5" />}
          />
        </div>

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand-orange px-5 py-3 text-sm font-bold text-white shadow-card transition hover:bg-brand-orangeDark sm:w-auto"
        >
          Send Quote on WhatsApp
        </a>
      </div>
    </section>
  );
}
