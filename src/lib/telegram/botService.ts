import { insforge } from "../insforge";
import { sendMessage, answerCallbackQuery } from "./telegramApi";

type BotStep = 
  | 'awaiting_service'
  | 'awaiting_name'
  | 'awaiting_city'
  | 'awaiting_attention'
  | 'awaiting_description'
  | 'awaiting_phone'
  | 'awaiting_urgency'
  | 'awaiting_source'
  | 'completed';

interface SessionData {
  service_type?: string;
  full_name?: string;
  city?: string;
  attention_type?: string;
  description?: string;
  phone?: string;
  urgency?: string;
  source?: string;
  telegram_username?: string;
  telegram_first_name?: string;
  telegram_last_name?: string;
}

export async function processTelegramUpdate(update: any) {
  try {
    if (update.message && update.message.text) {
      await handleTextMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
  } catch (error) {
    console.error("Error processing telegram update", error);
  }
}

async function getSession(chatId: number): Promise<{ step: BotStep, data: SessionData } | null> {
  const { data, error } = await insforge.database
    .from('telegram_sessions')
    .select('*')
    .eq('chat_id', chatId)
    .single();
    
  if (error || !data) return null;
  return { step: data.step as BotStep, data: data.collected_data as SessionData };
}

async function updateSession(chatId: number, step: BotStep, collectedData: SessionData) {
  await insforge.database
    .from('telegram_sessions')
    .upsert({
      chat_id: chatId,
      step: step,
      collected_data: collectedData,
      updated_at: new Date().toISOString()
    });
}

async function deleteSession(chatId: number) {
  await insforge.database.from('telegram_sessions').delete().eq('chat_id', chatId);
}

async function handleTextMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text.trim();

  // Siempre que escriban /start, reiniciamos la sesión
  if (text === '/start') {
    const initialData: SessionData = {
      telegram_username: message.from.username,
      telegram_first_name: message.from.first_name,
      telegram_last_name: message.from.last_name,
    };
    await updateSession(chatId, 'awaiting_service', initialData);
    
    await sendMessage(chatId, "¡Hola! 👋 Soy el asistente de José Cerón Tech.\n\n¿En qué te puedo ayudar hoy? Elige una opción:", {
      inline_keyboard: [
        [{ text: "📱 Celular", callback_data: "service_buy-phone" }, { text: "💻 PC / Laptop", callback_data: "service_pc-build" }],
        [{ text: "🌐 Página web", callback_data: "service_simple-web" }, { text: "🏪 Negocio digital", callback_data: "service_business-digital" }],
        [{ text: "🛡️ Seguridad básica", callback_data: "service_basic-security" }, { text: "🧾 Otro", callback_data: "service_other" }]
      ]
    });
    return;
  }

  const session = await getSession(chatId);
  if (!session) {
    await sendMessage(chatId, "Escribe /start para comenzar una nueva cotización.");
    return;
  }

  const { step, data } = session;

  switch (step) {
    case 'awaiting_name':
      data.full_name = text;
      await updateSession(chatId, 'awaiting_city', data);
      await sendMessage(chatId, "¡Gracias! ¿De qué ciudad o comunidad nos escribes?");
      break;

    case 'awaiting_city':
      data.city = text;
      await updateSession(chatId, 'awaiting_attention', data);
      await sendMessage(chatId, "¿Cómo prefieres que sea la atención?", {
        inline_keyboard: [
          [{ text: "Presencial", callback_data: "attn_presencial" }, { text: "Remota", callback_data: "attn_remota" }],
          [{ text: "No estoy seguro", callback_data: "attn_notsure" }]
        ]
      });
      break;

    case 'awaiting_description':
      data.description = text;
      await updateSession(chatId, 'awaiting_phone', data);
      await sendMessage(chatId, "Por favor, escribe tu número de WhatsApp o teléfono para contactarte:");
      break;

    case 'awaiting_phone':
      data.phone = text;
      await updateSession(chatId, 'awaiting_urgency', data);
      await sendMessage(chatId, "¿Qué tan urgente es tu solicitud?", {
        inline_keyboard: [
          [{ text: "Lo antes posible (Hoy)", callback_data: "urg_today" }],
          [{ text: "Esta semana", callback_data: "urg_week" }],
          [{ text: "Sin prisa", callback_data: "urg_norush" }]
        ]
      });
      break;
      
    default:
      await sendMessage(chatId, "Por favor, utiliza los botones o escribe /start para reiniciar.");
      break;
  }
}

async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const dataPayload = callbackQuery.data;
  
  await answerCallbackQuery(callbackQuery.id);

  const session = await getSession(chatId);
  if (!session) {
    await sendMessage(chatId, "Escribe /start para comenzar una nueva cotización.");
    return;
  }

  const { step, data } = session;

  if (dataPayload.startsWith('service_') && step === 'awaiting_service') {
    data.service_type = dataPayload.replace('service_', '');
    await updateSession(chatId, 'awaiting_name', data);
    await sendMessage(chatId, "Excelente. ¿Cuál es tu nombre completo?");
  } 
  else if (dataPayload.startsWith('attn_') && step === 'awaiting_attention') {
    data.attention_type = dataPayload.replace('attn_', '');
    await updateSession(chatId, 'awaiting_description', data);
    await sendMessage(chatId, "Describe brevemente tu problema o lo que necesitas:");
  }
  else if (dataPayload.startsWith('urg_') && step === 'awaiting_urgency') {
    data.urgency = dataPayload.replace('urg_', '');
    await updateSession(chatId, 'awaiting_source', data);
    await sendMessage(chatId, "¿Cómo nos encontraste?", {
      inline_keyboard: [
        [{ text: "Recomendación", callback_data: "src_recommend" }, { text: "Facebook", callback_data: "src_facebook" }],
        [{ text: "Ciber La Red", callback_data: "src_ciber" }, { text: "Búsqueda Web", callback_data: "src_other" }]
      ]
    });
  }
  else if (dataPayload.startsWith('src_') && step === 'awaiting_source') {
    data.source = dataPayload.replace('src_', '');
    data.source = data.source === 'other' ? 'telegram_bot' : data.source; // Identificar origen bot
    await finishQuote(chatId, data);
  }
}

async function finishQuote(chatId: number, data: SessionData) {
  // Borrar sesión
  await deleteSession(chatId);

  // Guardar en la tabla quotes de InsForge
  const quoteRow = {
    full_name: data.full_name,
    phone: data.phone,
    city: data.city,
    attention_type: data.attention_type,
    service_type: data.service_type,
    description: data.description,
    urgency: data.urgency,
    source: data.source,
    telegram_chat_id: chatId,
    telegram_username: data.telegram_username,
    telegram_first_name: data.telegram_first_name,
    telegram_last_name: data.telegram_last_name,
    telegram_status: 'completed',
    status: 'pending' // Estado general de la cotización
  };

  const { error } = await insforge.database.from('quotes').insert([quoteRow]);

  if (error) {
    console.error("Error inserting quote from Telegram", error);
    await sendMessage(chatId, "Hubo un error guardando tu solicitud. Por favor intenta de nuevo más tarde.");
    return;
  }

  // Notificar al usuario
  await sendMessage(chatId, "✅ *Gracias, recibí tu solicitud.*\n\nJosé revisará tu caso y te contactará pronto. Si es muy urgente, también puedes escribirle directamente por WhatsApp.");

  // Notificar al Owner
  await notifyOwner(quoteRow);
}

async function notifyOwner(quote: any) {
  const ownerChatId = import.meta.env.TELEGRAM_OWNER_CHAT_ID || process.env.TELEGRAM_OWNER_CHAT_ID;
  if (!ownerChatId) return;

  const msg = `🔔 *Nueva Cotización desde Telegram*\n\n` +
              `👤 *Cliente:* ${quote.full_name}\n` +
              `📍 *Ciudad:* ${quote.city}\n` +
              `📞 *Teléfono:* ${quote.phone}\n` +
              `🛠 *Servicio:* ${quote.service_type}\n` +
              `🏫 *Atención:* ${quote.attention_type}\n` +
              `📝 *Descripción:* ${quote.description}\n\n` +
              `@${quote.telegram_username || 'Sin_Usuario'}`;

  await sendMessage(Number(ownerChatId), msg);
}
