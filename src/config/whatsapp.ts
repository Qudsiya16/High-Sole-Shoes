/**
 * Central WhatsApp Business Support Configuration
 * Replace WHATSAPP_NUMBER with your store's international business number
 * (digits only, no '+' or spaces, e.g. '923001234567').
 */
export const WHATSAPP_NUMBER = '923001234567';

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi! I'm interested in your shoes and would like to know more about your products.";

export function buildWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppUrl(productName: string): string {
  const message = `Hi! I'm interested in the ${productName}. Can you provide more details about its availability, sizes, and colors?`;
  return buildWhatsAppUrl(message);
}
