import { PRICING } from "@/lib/constants";
import type { BillingCoverage, QuantitySlab, QuoteInput, QuoteResult } from "@/lib/types";

function getQuantitySlab(quantity: number): QuantitySlab {
  if (quantity < 1000) {
    return { label: "1-999 pcs", multiplier: 1.35 };
  }

  if (quantity < 2000) {
    return { label: "1000-1999 pcs", multiplier: 1.2 };
  }

  if (quantity < 5000) {
    return { label: "2000-4999 pcs", multiplier: 1 };
  }

  if (quantity < 10000) {
    return { label: "5000-9999 pcs", multiplier: 0.92 };
  }

  return { label: "10000+ pcs", multiplier: 0.85 };
}

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
  const quantitySlab = getQuantitySlab(input.quantity);

  const inkCostPerUnit =
    PRICING.COST_PER_ML *
    PRICING.INK_CONSUMPTION_100 *
    (billingCoverage / 100) *
    unitArea;

  const baseProductionCostPerUnit = inkCostPerUnit + PRICING.OVERHEAD_PER_UNIT;
  const rawCostPerUnit = baseProductionCostPerUnit * quantitySlab.multiplier;
  const finalCostBeforeMinimum = rawCostPerUnit / (1 - PRICING.PROFIT_MARGIN);
  const minimumPricePerUnit =
    unitArea <= PRICING.MINIMUM_AREA ? PRICING.MINIMUM_PRICE_PER_UNIT : 0;
  const pricePerUnit = Math.max(finalCostBeforeMinimum, minimumPricePerUnit);
  const minimumRateApplied = pricePerUnit === minimumPricePerUnit;


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
    minimumRateApplied,
    internal: {
      quantitySlab,
      quantityMultiplier: quantitySlab.multiplier,
      inkCostPerUnit,
      overheadPerUnit: PRICING.OVERHEAD_PER_UNIT,
      baseProductionCostPerUnit,
      rawCostPerUnit,
      finalCostBeforeMinimum,
      profitMargin: PRICING.PROFIT_MARGIN
    }
  };
}
