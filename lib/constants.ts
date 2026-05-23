export const BUSINESS = {
  name: "Watrmark Pvt Ltd",
  slogan: "Print Your Mark",
  website: "www.watrmark.com",
  whatsappNumber: "919594982306",
  displayWhatsApp: "+919594982306"
} as const;

export const PRICING = {
  INK_COST_PER_LITRE: 3500,
  INK_YIELD_ML: 900,
  COST_PER_ML: 3.8889,
  INK_CONSUMPTION_100: 0.005,
  OVERHEAD_PER_UNIT: 0.49,
  PROFIT_MARGIN: 0.2,
  MINIMUM_PRICE_PER_UNIT: 0.5,
  MINIMUM_AREA: 9
} as const;

export const UPLOAD_LIMITS = {
  maxBytes: 5 * 1024 * 1024,
  allowedTypes: ["image/png", "image/jpeg"] as const,
  maxAnalysisDimension: 1200
} as const;

export function isAllowedImageType(value: string) {
  return (UPLOAD_LIMITS.allowedTypes as readonly string[]).includes(value);
}
