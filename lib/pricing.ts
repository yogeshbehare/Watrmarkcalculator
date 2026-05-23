import { PRICING } from "@/lib/constants";
import type { BillingCoverage, QuoteInput, QuoteResult } from "@/lib/types";

export function mapCoverageToBillingTier(coveragePercent: number): BillingCoverage {
  if (coveragePercent <= 10) return 10;
  if (coveragePercent <= 25) return 25;
  if (coveragePercent <= 50) return 50;
  return 100;
}

export function calculateQuote(
  input: QuoteInput,
  coveragePercent: number,
  billingCoverage: BillingCoverage
): QuoteResult {
  const unitArea = input.width * input.height;
  const totalArea = unitArea * input.quantity;
  const minimumRateApplied = unitArea <= PRICING.MINIMUM_AREA;

  let pricePerUnit = PRICING.MINIMUM_PRICE_PER_UNIT;

  if (!minimumRateApplied) {
    // The business formula estimates ink, adds overhead, then gross-ups for margin.
    const inkCostPerUnit =
      PRICING.COST_PER_ML *
      PRICING.INK_CONSUMPTION_100 *
      (billingCoverage / 100) *
      unitArea;

    const rawCostPerUnit = inkCostPerUnit + PRICING.OVERHEAD_PER_UNIT;
    pricePerUnit = rawCostPerUnit / (1 - PRICING.PROFIT_MARGIN);
  }

  return {
    width: input.width,
    height: input.height,
    quantity: input.quantity,
    coveragePercent,
    billingCoverage,
    pricePerUnit,
    pricePerSqInch: unitArea > 0 ? pricePerUnit / unitArea : 0,
    unitArea,
    totalArea,
    totalOrderValue: pricePerUnit * input.quantity,
    minimumRateApplied
  };
}
