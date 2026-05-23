import { BUSINESS } from "@/lib/constants";
import type { QuoteResult } from "@/lib/types";

export function buildWhatsAppQuoteMessage(quote: QuoteResult) {
  const minimumLine = quote.minimumRateApplied
    ? "\n\n*(Minimum rate applied)*"
    : "";

  return `*Watrmark Print Quote*

📐 Print Size: ${quote.width} × ${quote.height} inches
📦 Quantity: ${quote.quantity} units
🎨 Coverage: ${quote.coveragePercent.toFixed(2)}%
💰 Price Per Unit: ₹${quote.pricePerUnit.toFixed(2)}*
🧾 Total: ₹${quote.totalOrderValue.toFixed(2)}*${minimumLine}

*Prices are excluding government taxes and transportation.

Please confirm this quote and proceed with the order.`;
}

export function buildWhatsAppQuoteUrl(quote: QuoteResult) {
  const message = buildWhatsAppQuoteMessage(quote);
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
