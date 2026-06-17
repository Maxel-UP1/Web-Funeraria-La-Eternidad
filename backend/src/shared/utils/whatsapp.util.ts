/**
 * Generate WhatsApp deep link with pre-formatted message
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  productName: string,
  customerName: string,
  quantity: number = 1,
): string {
  const message = [
    `¡Hola! Soy ${customerName}.`,
    `Estoy interesado/a en: ${productName}`,
    `Cantidad: ${quantity}`,
    `Quisiera más información por favor.`,
  ].join('\n');

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
