/**
 * Genera un enlace a Telegram bot con un comando start prellenado.
 */
const TELEGRAM_BOT_USERNAME = 'KimJesusCeronTechBot';

export function telegramLink(serviceId?: string): string {
  const baseUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}`;
  if (serviceId) {
    return `${baseUrl}?start=${encodeURIComponent(serviceId)}`;
  }
  return baseUrl;
}
