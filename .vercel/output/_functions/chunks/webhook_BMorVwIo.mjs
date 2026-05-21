import { createClient } from '@insforge/sdk';

const insforgeUrl = "https://ckde3c4f.us-east.insforge.app";
const insforgeAnonKey = "ik_5d51a851dab9aef6bcfa5b4d45f345d8";
const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey
});

const serviceTypeLabels = {
  "business-digital": "Digitalización para negocio",
  "phone-advice": "Asesoría para comprar celular",
  "buy-phone": "Asesoría para comprar celular",
  "phone-setup": "Configuración de celular nuevo",
  "setup-phone": "Configuración de celular nuevo",
  "tech-support": "Soporte técnico básico",
  "pc-laptop": "PC / Laptop",
  "pc-build": "PC / Laptop",
  "laptop-advice": "PC / Laptop",
  website: "Página web",
  "simple-web": "Página web",
  security: "Seguridad digital básica",
  "basic-security": "Seguridad digital básica",
  other: "Otro"
};
const attentionTypeLabels = {
  remote: "Remota",
  remota: "Remota",
  presential: "Presencial",
  presencial: "Presencial",
  notsure: "No estoy seguro"
};
function formatServiceType(value) {
  const key = String(value || "").trim();
  return serviceTypeLabels[key] || key || "-";
}
function formatAttentionType(value) {
  const key = String(value || "").trim();
  return attentionTypeLabels[key] || key || "-";
}

const getBotToken = () => {
  const token = "8856545923:AAHNYmfsK-48fJSzxGOMOrzHTkV2yKOjIrA";
  return token;
};
async function sendMessage(chatId, text, replyMarkup) {
  const url = `https://api.telegram.org/bot${getBotToken()}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown"
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    console.error("Telegram API Error:", await response.text());
  }
}
async function answerCallbackQuery(callbackQueryId, text) {
  const url = `https://api.telegram.org/bot${getBotToken()}/answerCallbackQuery`;
  const payload = {
    callback_query_id: callbackQueryId
  };
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

const HUMAN_ATTENTION_MESSAGE = "Claro, ya le avisé a José para que revise tu caso personalmente. Mientras tanto, puedes dejarme más detalles del problema.";
const HUMAN_ATTENTION_TRIGGERS = [
  "humano",
  "hablar con jose",
  "hablar con josé",
  "asesor",
  "quiero hablar contigo",
  "contacto"
];
async function processTelegramUpdate(update) {
  try {
    console.log("[telegram] Processing update", {
      updateId: update?.update_id,
      hasMessage: Boolean(update?.message),
      hasCallbackQuery: Boolean(update?.callback_query),
      chatId: update?.message?.chat?.id || update?.callback_query?.message?.chat?.id
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
async function getSession(chatId) {
  const { data, error } = await insforge.database.from("telegram_sessions").select("*").eq("chat_id", chatId).single();
  if (error || !data) return null;
  return { step: data.step, data: data.collected_data };
}
async function updateSession(chatId, step, collectedData) {
  await insforge.database.from("telegram_sessions").upsert({
    chat_id: chatId,
    step,
    collected_data: collectedData,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  });
}
function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function nullableString(value) {
  const cleaned = cleanString(value);
  return cleaned.length > 0 ? cleaned : null;
}
function getInsForgeErrorDetails(error) {
  return {
    statusCode: error?.statusCode || error?.status || error?.code || null,
    responseBody: {
      error: error?.error,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      nextActions: error?.nextActions
    },
    rawError: error
  };
}
function logInsForgeFailure(context, error, payload) {
  console.error(`[insforge] ${context}`, {
    table: "quotes",
    ...getInsForgeErrorDetails(error),
    payload
  });
}
function buildTelegramQuotePayload(chatId, data) {
  return {
    full_name: cleanString(data.full_name),
    phone: cleanString(data.phone),
    email: null,
    city: cleanString(data.city),
    attention_type: cleanString(data.attention_type) || "notsure",
    service_type: cleanString(data.service_type) || "other",
    description: cleanString(data.description),
    budget: null,
    urgency: cleanString(data.urgency) || "norush",
    source: cleanString(data.source) || "telegram_bot",
    status: "nueva",
    telegram_chat_id: chatId,
    telegram_username: nullableString(data.telegram_username),
    telegram_first_name: nullableString(data.telegram_first_name),
    telegram_last_name: nullableString(data.telegram_last_name),
    telegram_status: "new",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function saveInboundTelegramMessage(chatId, messageText) {
  const openQuote = await findOpenTelegramQuote(chatId);
  if (!openQuote?.id) return;
  const { error } = await insforge.database.from("telegram_messages").insert([{
    quote_id: openQuote.id,
    telegram_chat_id: chatId,
    direction: "inbound",
    message_text: messageText
  }]);
  if (error) {
    console.error("Error saving inbound Telegram message", error);
  }
}
function wantsHumanAttention(text) {
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return HUMAN_ATTENTION_TRIGGERS.some(
    (trigger) => normalized.includes(trigger.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );
}
function getTelegramDisplayName(message, sessionData) {
  if (sessionData?.full_name) return sessionData.full_name;
  const firstName = message.from?.first_name || sessionData?.telegram_first_name || "";
  const lastName = message.from?.last_name || sessionData?.telegram_last_name || "";
  const name = `${firstName} ${lastName}`.trim();
  return name || "Usuario de Telegram";
}
function escapeTelegramMarkdown(value) {
  return String(value ?? "-").replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}
function isOpenQuote(quote) {
  const status = String(quote?.status || "").toLowerCase();
  return !["accepted", "rejected", "completed", "cerrado", "rechazado", "aceptado"].includes(status);
}
async function findOpenTelegramQuote(chatId) {
  const { data, error } = await insforge.database.from("quotes").select("*").eq("telegram_chat_id", chatId).order("created_at", { ascending: false });
  if (error || !Array.isArray(data)) return null;
  return data.find(isOpenQuote) || null;
}
async function requestHumanAttention(message, session) {
  const chatId = message.chat.id;
  const text = message.text.trim();
  const sessionData = session?.data || {};
  const fullName = getTelegramDisplayName(message, sessionData);
  const username = message.from?.username || sessionData.telegram_username || null;
  const serviceType = sessionData.service_type || null;
  const openQuote = await findOpenTelegramQuote(chatId);
  const quoteData = {
    telegram_status: "human_requested",
    telegram_chat_id: chatId,
    telegram_username: username,
    telegram_first_name: message.from?.first_name || sessionData.telegram_first_name || null,
    telegram_last_name: message.from?.last_name || sessionData.telegram_last_name || null,
    service_type: serviceType || openQuote?.service_type || "other"
  };
  if (openQuote?.id) {
    const { error } = await insforge.database.from("quotes").update(quoteData).eq("id", openQuote.id);
    if (error) {
      console.error("Error updating quote for human attention", error);
      await sendMessage(chatId, "No pude guardar tu solicitud de atención humana. Intenta de nuevo en un momento.");
      return;
    }
  } else {
    const { data: newQuote, error } = await insforge.database.from("quotes").insert([{
      ...quoteData,
      full_name: fullName,
      phone: "",
      city: "",
      attention_type: "notsure",
      description: text,
      urgency: "norush",
      source: "telegram_bot",
      status: "nueva"
    }]).select("id").single();
    if (error) {
      console.error("Error creating quote for human attention", error);
      await sendMessage(chatId, "No pude guardar tu solicitud de atención humana. Intenta de nuevo en un momento.");
      return;
    }
    if (newQuote?.id) {
      const { error: messageError } = await insforge.database.from("telegram_messages").insert([{
        quote_id: newQuote.id,
        telegram_chat_id: chatId,
        direction: "inbound",
        message_text: text
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
    serviceType: serviceType || openQuote?.service_type || "-"
  });
}
async function notifyHumanAttentionOwner(details) {
  const ownerChatId = "5493899292";
  const msg = `El usuario quiere atención humana

*Nombre:* ${escapeTelegramMarkdown(details.fullName)}
*Username:* ${escapeTelegramMarkdown(details.username ? `@${details.username}` : "Sin username")}
*Chat ID:* ${escapeTelegramMarkdown(details.chatId)}
*Último mensaje:* ${escapeTelegramMarkdown(details.lastMessage)}
*Servicio:* ${escapeTelegramMarkdown(formatServiceType(details.serviceType))}`;
  await sendMessage(Number(ownerChatId), msg);
}
async function handleTextMessage(message) {
  const chatId = message.chat.id;
  const text = message.text.trim();
  if (text === "/start") {
    const initialData = {
      telegram_username: message.from.username,
      telegram_first_name: message.from.first_name,
      telegram_last_name: message.from.last_name
    };
    await updateSession(chatId, "awaiting_service", initialData);
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
    case "awaiting_name":
      data.full_name = text;
      await updateSession(chatId, "awaiting_city", data);
      await sendMessage(chatId, "¡Gracias! ¿De qué ciudad o comunidad nos escribes?");
      break;
    case "awaiting_city":
      data.city = text;
      await updateSession(chatId, "awaiting_attention", data);
      await sendMessage(chatId, "¿Cómo prefieres que sea la atención?", {
        inline_keyboard: [
          [{ text: "Presencial", callback_data: "attn_presencial" }, { text: "Remota", callback_data: "attn_remota" }],
          [{ text: "No estoy seguro", callback_data: "attn_notsure" }]
        ]
      });
      break;
    case "awaiting_description":
      data.description = text;
      await updateSession(chatId, "awaiting_phone", data);
      await sendMessage(chatId, "Por favor, escribe tu número de WhatsApp o teléfono para contactarte:");
      break;
    case "awaiting_phone":
      data.phone = text;
      await updateSession(chatId, "awaiting_urgency", data);
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
async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const dataPayload = callbackQuery.data;
  await answerCallbackQuery(callbackQuery.id);
  const session = await getSession(chatId);
  if (!session) {
    await sendMessage(chatId, "Escribe /start para comenzar una nueva cotización.");
    return;
  }
  const { step, data } = session;
  if (dataPayload.startsWith("service_") && step === "awaiting_service") {
    data.service_type = dataPayload.replace("service_", "");
    await updateSession(chatId, "awaiting_name", data);
    await sendMessage(chatId, "Excelente. ¿Cuál es tu nombre completo?");
  } else if (dataPayload.startsWith("attn_") && step === "awaiting_attention") {
    data.attention_type = dataPayload.replace("attn_", "");
    await updateSession(chatId, "awaiting_description", data);
    await sendMessage(chatId, "Describe brevemente tu problema o lo que necesitas:");
  } else if (dataPayload.startsWith("urg_") && step === "awaiting_urgency") {
    data.urgency = dataPayload.replace("urg_", "");
    await updateSession(chatId, "awaiting_source", data);
    await sendMessage(chatId, "¿Cómo nos encontraste?", {
      inline_keyboard: [
        [{ text: "Recomendación", callback_data: "src_recommend" }, { text: "Facebook", callback_data: "src_facebook" }],
        [{ text: "Ciber La Red", callback_data: "src_ciber" }, { text: "Búsqueda Web", callback_data: "src_other" }]
      ]
    });
  } else if (dataPayload.startsWith("src_") && step === "awaiting_source") {
    data.source = dataPayload.replace("src_", "");
    data.source = data.source === "other" ? "telegram_bot" : data.source;
    await finishTelegramQuote(chatId, data);
  }
}
async function finishTelegramQuote(chatId, data) {
  const quoteRow = buildTelegramQuotePayload(chatId, data);
  console.log("[telegram] Saving quote to InsForge", {
    table: "quotes",
    chatId,
    serviceType: quoteRow.service_type,
    attentionType: quoteRow.attention_type,
    status: quoteRow.status,
    telegramStatus: quoteRow.telegram_status,
    hasInsForgeUrl: Boolean("https://ckde3c4f.us-east.insforge.app"),
    hasInsForgeAnonKey: Boolean("ik_5d51a851dab9aef6bcfa5b4d45f345d8")
  });
  const { data: insertedQuote, error } = await insforge.database.from("quotes").insert([quoteRow]).select("id").single();
  if (error) {
    logInsForgeFailure("Error inserting Telegram quote", error, quoteRow);
    await sendMessage(chatId, "Hubo un error guardando tu solicitud. Por favor intenta de nuevo más tarde.");
    return;
  }
  console.log("[telegram] Quote saved successfully", {
    table: "quotes",
    quoteId: insertedQuote?.id,
    chatId
  });
  const { error: deleteSessionError } = await insforge.database.from("telegram_sessions").delete().eq("chat_id", chatId);
  if (deleteSessionError) {
    console.error("[telegram] Quote saved, but session cleanup failed", {
      chatId,
      ...getInsForgeErrorDetails(deleteSessionError)
    });
  }
  await sendMessage(chatId, "✅ *Gracias, recibí tu solicitud.*\n\nJosé revisará tu caso y te contactará pronto. Si es muy urgente, también puedes escribirle directamente por WhatsApp.");
  await notifyOwner(quoteRow);
}
async function notifyOwner(quote) {
  const ownerChatId = "5493899292";
  const msg = `🔔 *Nueva Cotización desde Telegram*

👤 *Cliente:* ${quote.full_name}
📍 *Ciudad:* ${quote.city}
📞 *Teléfono:* ${quote.phone}
🛠 *Servicio:* ${formatServiceType(quote.service_type)}
🏫 *Atención:* ${formatAttentionType(quote.attention_type)}
📝 *Descripción:* ${quote.description}

@${quote.telegram_username || "Sin_Usuario"}`;
  await sendMessage(Number(ownerChatId), msg);
}

const prerender = false;
const POST = async ({ request }) => {
  try {
    const secret = request.headers.get("x-telegram-bot-api-secret-token");
    const envSecret = "KimJesus21";
    if (envSecret && secret !== envSecret) {
      console.warn("[telegram:webhook] Rejected request: invalid secret token", {
        hasExpectedSecret: Boolean(envSecret),
        hasIncomingSecret: Boolean(secret)
      });
      return new Response("Unauthorized", { status: 403 });
    }
    const update = await request.json();
    console.log("[telegram:webhook] Update received", {
      updateId: update?.update_id,
      chatId: update?.message?.chat?.id || update?.callback_query?.message?.chat?.id,
      hasMessage: Boolean(update?.message),
      hasCallbackQuery: Boolean(update?.callback_query),
      hasTelegramBotToken: Boolean("8856545923:AAHNYmfsK-48fJSzxGOMOrzHTkV2yKOjIrA"),
      hasInsForgeUrl: Boolean("https://ckde3c4f.us-east.insforge.app"),
      hasInsForgeAnonKey: Boolean("ik_5d51a851dab9aef6bcfa5b4d45f345d8")
    });
    await processTelegramUpdate(update);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[telegram:webhook] Unhandled error:", err);
    return new Response("Error handled", { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
