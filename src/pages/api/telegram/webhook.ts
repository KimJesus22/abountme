import type { APIRoute } from 'astro';
import { processTelegramUpdate } from '../../../lib/telegram/botService';

// Habilitar SSR (Server-Side Rendering) para este endpoint para que Vercel lo trate como Serverless Function
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const secret = request.headers.get('x-telegram-bot-api-secret-token');
    const envSecret = import.meta.env.TELEGRAM_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET;

    // Validación básica de seguridad
    if (envSecret && secret !== envSecret) {
      return new Response('Unauthorized', { status: 403 });
    }

    const update = await request.json();
    
    // Procesamos la actualización (en Vercel Serverless debemos hacer await para que no muera el proceso)
    await processTelegramUpdate(update);

    // Responder rápido a Telegram con 200 OK para que no reintente
    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    // Devolvemos 200 para que Telegram no se quede en un bucle de reintentos infinitos si hay un bug en el bot.
    return new Response('Error handled', { status: 200 });
  }
};
