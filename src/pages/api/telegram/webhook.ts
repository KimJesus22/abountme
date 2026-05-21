import type { APIRoute } from 'astro';
import { processTelegramUpdate } from '../../../lib/telegram/botService';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const secret = request.headers.get('x-telegram-bot-api-secret-token');
    const envSecret = import.meta.env.TELEGRAM_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET;

    if (envSecret && secret !== envSecret) {
      console.warn('[telegram:webhook] Rejected request: invalid secret token', {
        hasExpectedSecret: Boolean(envSecret),
        hasIncomingSecret: Boolean(secret),
      });
      return new Response('Unauthorized', { status: 403 });
    }

    const update = await request.json();

    console.log('[telegram:webhook] Update received', {
      updateId: update?.update_id,
      chatId: update?.message?.chat?.id || update?.callback_query?.message?.chat?.id,
      hasMessage: Boolean(update?.message),
      hasCallbackQuery: Boolean(update?.callback_query),
      hasTelegramBotToken: Boolean(import.meta.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN),
      hasInsForgeUrl: Boolean(import.meta.env.PUBLIC_INSFORGE_URL),
      hasInsForgeAnonKey: Boolean(import.meta.env.PUBLIC_INSFORGE_ANON_KEY),
    });

    await processTelegramUpdate(update);

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('[telegram:webhook] Unhandled error:', err);
    return new Response('Error handled', { status: 200 });
  }
};
