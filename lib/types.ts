export type BillingCoverage = 10 | 25 | 50 | 100;

export type QuoteInput = {
  width: number;
  height: number;
  quantity: number;
};

export type QuantitySlab = {
  label: string;
  multiplier: number;
};

export type ArtworkAnalysis = {
  coveragePercent: number;
  averageInkDensity: number;
  billingCoverage: BillingCoverage;
  printablePixels: number;
  analyzedPixels: number;
  ignoredWhitePixels: number;
  ignoredTransparentPixels: number;
  resizedWidth: number;
  resizedHeight: number;
};

export type QuoteResult = {
  coveragePercent: number;
  billingCoverage: BillingCoverage;
  pricePerUnit: number;
  pricePerSqInch: number;
  unitArea: number;
  totalArea: number;
  totalOrderValue: number;
  minimumRateApplied: boolean;
  quantity: number;
  width: number;
  height: number;
  internal: {
    quantitySlab: QuantitySlab;
    quantityMultiplier: number;
    inkCostPerUnit: number;
    overheadPerUnit: number;
    baseProductionCostPerUnit: number;
    rawCostPerUnit: number;
    finalCostBeforeMinimum: number;
    profitMargin: number;
  };
};

export type AnalyzeResponse = {
  analysis: ArtworkAnalysis;
  quote: QuoteResult;
};
