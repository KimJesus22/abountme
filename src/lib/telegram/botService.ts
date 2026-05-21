import { insforge } from "../insforge";
import { formatAttentionType, formatServiceType } from "../quotes/formatters";
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

type QuoteInsertPayload = {
  full_name: string;
  phone: string;
  email: string | null;
  city: string;
  attention_type: string;
  service_type: string;
  description: string;
  budget: string | null;
  urgency: string;
  source: string;
  status: 'nueva';
  telegram_chat_id: number;
  telegram_username: string | null;
  telegram_first_name: string | null;
  telegram_last_name: string | null;
  telegram_status: 'new';
  created_at: string;
};

const HUMAN_ATTENTION_MESSAGE = "Claro, ya le avis\u00e9 a Jos\u00e9 para que revise tu caso personalmente. Mientras tanto, puedes dejarme m\u00e1s detalles del problema.";

const HUMAN_ATTENTION_TRIGGERS = [
  "humano",
  "hablar con jose",
  "hablar con jos\u00e9",
  "asesor",
  "quiero hablar contigo",
  "contacto",
];

export async function processTelegramUpdate(update: any) {
  try {
    console.log("[telegram] Processing update", {
      updateId: update?.update_id,
      hasMessage: Boolean(update?.message),
      hasCallbackQuery: Boolean(update?.callback_query),
      chatId: update?.message?.chat?.id || update?.callback_query?.message?.chat?.id,
    });

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

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function nullableString(value: unknown) {
  const cleaned = cleanString(value);
  return cleaned.length > 0 ? cleaned : null;
}

function getInsForgeErrorDetails(error: any) {
  return {
    statusCode: error?.statusCode || error?.status || error?.code || null,
    responseBody: {
      error: error?.error,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      nextActions: error?.nextActions,
    },
    rawError: error,
  };
}

function logInsForgeFailure(context: string, error: any, payload: unknown) {
  console.error(`[insforge] ${context}`, {
    table: 'quotes',
    ...getInsForgeErrorDetails(error),
    payload,
  });
}

function buildTelegramQuotePayload(chatId: number, data: SessionData): QuoteInsertPayload {
  return {
    full_name: cleanString(data.full_name),
    phone: cleanString(data.phone),
    email: null,
    city: cleanString(data.city),
    attention_type: cleanString(data.attention_type) || 'notsure',
    service_type: cleanString(data.service_type) || 'other',
    description: cleanString(data.description),
    budget: null,
    urgency: cleanString(data.urgency) || 'norush',
    source: cleanString(data.source) || 'telegram_bot',
    status: 'nueva',
    telegram_chat_id: chatId,
    telegram_username: nullableString(data.telegram_username),
    telegram_first_name: nullableString(data.telegram_first_name),
    telegram_last_name: nullableString(data.telegram_last_name),
    telegram_status: 'new',
    created_at: new Date().toISOString(),
  };
}

async function saveInboundTelegramMessage(chatId: number, messageText: string) {
  const openQuote = await findOpenTelegramQuote(chatId);
  if (!openQuote?.id) return;

  const { error } = await insforge.database.from('telegram_messages').insert([{
    quote_id: openQuote.id,
    telegram_chat_id: chatId,
    direction: 'inbound',
    message_text: messageText,
  }]);

  if (error) {
    console.error("Error saving inbound Telegram message", error);
  }
}

function wantsHumanAttention(text: string) {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return HUMAN_ATTENTION_TRIGGERS.some((trigger) =>
    normalized.includes(trigger.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
  );
}

function getTelegramDisplayName(message: any, sessionData?: SessionData) {
  if (sessionData?.full_name) return sessionData.full_name;

  const firstName = message.from?.first_name || sessionData?.telegram_first_name || '';
  const lastName = message.from?.last_name || sessionData?.telegram_last_name || '';
  const name = `${firstName} ${lastName}`.trim();

  return name || 'Usuario de Telegram';
}

function escapeTelegramMarkdown(value: unknown) {
  return String(value ?? '-').replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function isOpenQuote(quote: any) {
  const status = String(quote?.status || '').toLowerCase();
  return !['accepted', 'rejected', 'completed', 'cerrado', 'rechazado', 'aceptado'].includes(status);
}

async function findOpenTelegramQuote(chatId: number) {
  const { data, error } = await insforge.database
    .from('quotes')
    .select('*')
    .eq('telegram_chat_id', chatId)
    .order('created_at', { ascending: false });

  if (error || !Array.isArray(data)) return null;
  return data.find(isOpenQuote) || null;
}

async function requestHumanAttention(message: any, session: { step: BotStep, data: SessionData } | null) {
  const chatId = message.chat.id;
  const text = message.text.trim();
  const sessionData = session?.data || {};
  const fullName = getTelegramDisplayName(message, sessionData);
  const username = message.from?.username || sessionData.telegram_username || null;
  const serviceType = sessionData.service_type || null;

  const openQuote = await findOpenTelegramQuote(chatId);
  const quoteData = {
    telegram_status: 'human_requested',
    telegram_chat_id: chatId,
    telegram_username: username,
    telegram_first_name: message.from?.first_name || sessionData.telegram_first_name || null,
    telegram_last_name: message.from?.last_name || sessionData.telegram_last_name || null,
    service_type: serviceType || openQuote?.service_type || 'other',
  };

  if (openQuote?.id) {
    const { error } = await insforge.database
      .from('quotes')
      .update(quoteData)
      .eq('id', openQuote.id);

    if (error) {
      console.error("Error updating quote for human attention", error);
      await sendMessage(chatId, "No pude guardar tu solicitud de atenci\u00f3n humana. Intenta de nuevo en un momento.");
      return;
    }
  } else {
    const { data: newQuote, error } = await insforge.database.from('quotes').insert([{
      ...quoteData,
      full_name: fullName,
      phone: '',
      city: '',
      attention_type: 'notsure',
      description: text,
      urgency: 'norush',
      source: 'telegram_bot',
      status: 'nueva',
    }]).select('id').single();

    if (error) {
      console.error("Error creating quote for human attention", error);
      await sendMessage(chatId, "No pude guardar tu solicitud de atenci\u00f3n humana. Intenta de nuevo en un momento.");
      return;
    }

    if (newQuote?.id) {
      const { error: messageError } = await insforge.database.from('telegram_messages').insert([{
        quote_id: newQuote.id,
        telegram_chat_id: chatId,
        direction: 'inbound',
        message_text: text,
      }]);

      if (messageError) {
        console.error("Error saving initial human attention message", messageError);
      }
    }
  }

  await sendMessage(chatId, HUMAN_ATTENTION_MESSAGE);
  await notifyHumanAttentionOwner({
    fullName,
    username,
    chatId,
    lastMessage: text,
    serviceType: serviceType || openQuote?.service_type || '-',
  });
}

async function notifyHumanAttentionOwner(details: {
  fullName: string;
  username: string | null;
  chatId: number;
  lastMessage: string;
  serviceType: string;
}) {
  const ownerChatId = import.meta.env.TELEGRAM_OWNER_CHAT_ID || process.env.TELEGRAM_OWNER_CHAT_ID;
  if (!ownerChatId) return;

  const msg = `El usuario quiere atenci\u00f3n humana\n\n` +
              `*Nombre:* ${escapeTelegramMarkdown(details.fullName)}\n` +
              `*Username:* ${escapeTelegramMarkdown(details.username ? `@${details.username}` : 'Sin username')}\n` +
              `*Chat ID:* ${escapeTelegramMarkdown(details.chatId)}\n` +
              `*Último mensaje:* ${escapeTelegramMarkdown(details.lastMessage)}\n` +
              `*Servicio:* ${escapeTelegramMarkdown(formatServiceType(details.serviceType))}`;

  await sendMessage(Number(ownerChatId), msg);
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
  await saveInboundTelegramMessage(chatId, text);

  if (wantsHumanAttention(text)) {
    await requestHumanAttention(message, session);
    return;
  }

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
    await finishTelegramQuote(chatId, data);
  }
}

async function finishTelegramQuote(chatId: number, data: SessionData) {
  const quoteRow = buildTelegramQuotePayload(chatId, data);

  console.log("[telegram] Saving quote to InsForge", {
    table: 'quotes',
    chatId,
    serviceType: quoteRow.service_type,
    attentionType: quoteRow.attention_type,
    status: quoteRow.status,
    telegramStatus: quoteRow.telegram_status,
    hasInsForgeUrl: Boolean(import.meta.env.PUBLIC_INSFORGE_URL),
    hasInsForgeAnonKey: Boolean(import.meta.env.PUBLIC_INSFORGE_ANON_KEY),
  });

  const { data: insertedQuote, error } = await insforge.database
    .from('quotes')
    .insert([quoteRow])
    .select('id')
    .single();

  if (error) {
    logInsForgeFailure("Error inserting Telegram quote", error, quoteRow);
    await sendMessage(chatId, "Hubo un error guardando tu solicitud. Por favor intenta de nuevo más tarde.");
    return;
  }

  console.log("[telegram] Quote saved successfully", {
    table: 'quotes',
    quoteId: insertedQuote?.id,
    chatId,
  });

  const { error: deleteSessionError } = await insforge.database
    .from('telegram_sessions')
    .delete()
    .eq('chat_id', chatId);

  if (deleteSessionError) {
    console.error("[telegram] Quote saved, but session cleanup failed", {
      chatId,
      ...getInsForgeErrorDetails(deleteSessionError),
    });
  }

  await sendMessage(chatId, "✅ *Gracias, recibí tu solicitud.*\n\nJosé revisará tu caso y te contactará pronto. Si es muy urgente, también puedes escribirle directamente por WhatsApp.");
  await notifyOwner(quoteRow);
}

async function notifyOwner(quote: any) {
  const ownerChatId = import.meta.env.TELEGRAM_OWNER_CHAT_ID || process.env.TELEGRAM_OWNER_CHAT_ID;
  if (!ownerChatId) return;

  const msg = `🔔 *Nueva Cotización desde Telegram*\n\n` +
              `👤 *Cliente:* ${quote.full_name}\n` +
              `📍 *Ciudad:* ${quote.city}\n` +
              `📞 *Teléfono:* ${quote.phone}\n` +
              `🛠 *Servicio:* ${formatServiceType(quote.service_type)}\n` +
              `🏫 *Atención:* ${formatAttentionType(quote.attention_type)}\n` +
              `📝 *Descripción:* ${quote.description}\n\n` +
              `@${quote.telegram_username || 'Sin_Usuario'}`;

  await sendMessage(Number(ownerChatId), msg);
}
