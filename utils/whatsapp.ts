import { BUSINESS } from "@/lib/constants";
import type { QuoteResult } from "@/lib/types";

export function buildWhatsAppQuoteMessage(quote: QuoteResult) {
  return `*Watrmark Print Quote*

📐 Print Size: ${quote.width} × ${quote.height} inches
📦 Quantity: ${quote.quantity} pcs

💰 Final Unit Price: ₹${quote.pricePerUnit.toFixed(2)}*
🧾 Total Order Value: ₹${quote.totalOrderValue.toFixed(2)}*

*Printing cost only. Product cost, GST, and transportation are excluded.

Please confirm to proceed with production.`;
}

export function buildWhatsAppQuoteUrl(quote: QuoteResult) {
  const message = buildWhatsAppQuoteMessage(quote);
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
