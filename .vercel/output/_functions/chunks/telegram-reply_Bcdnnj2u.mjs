import { createClient } from '@insforge/sdk';

const insforgeUrl = "https://ckde3c4f.us-east.insforge.app";
const insforgeAnonKey = "ik_5d51a851dab9aef6bcfa5b4d45f345d8";
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
function isAdminReferer(request) {
  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    const refererUrl = new URL(referer);
    const requestUrl = new URL(request.url);
    return refererUrl.origin === requestUrl.origin && refererUrl.pathname.startsWith("/admin");
  } catch {
    return false;
  }
}
function getBearerToken(request) {
  const authHeader = request.headers.get("authorization") || "";
  const [scheme, token] = authHeader.split(" ");
  return scheme?.toLowerCase() === "bearer" ? token : null;
}
const prerender = false;
const POST = async ({ request }) => {
  if (!isAdminReferer(request)) {
    return jsonResponse({ error: "Forbidden" }, 403);
  }
  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }
  const adminClient = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey,
    edgeFunctionToken: accessToken
  });
  const { data: authData, error: authError } = await adminClient.auth.getCurrentUser();
  if (authError || !authData?.user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }
  const dataClient = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey
  });
  const { quoteId, telegramChatId, message } = await request.json();
  const cleanMessage = String(message || "").trim();
  const chatId = Number(telegramChatId);
  if (!quoteId || !Number.isFinite(chatId) || !cleanMessage) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }
  const { data: quoteData, error: quoteError } = await dataClient.database.from("quotes").select("id, telegram_chat_id").eq("id", quoteId).single();
  if (quoteError || !quoteData || Number(quoteData.telegram_chat_id) !== chatId) {
    return jsonResponse({ error: "Quote not found" }, 404);
  }
  const botToken = "8856545923:AAHNYmfsK-48fJSzxGOMOrzHTkV2yKOjIrA";
  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: cleanMessage,
      parse_mode: "Markdown"
    })
  });
  if (!telegramResponse.ok) {
    const details = await telegramResponse.text();
    console.error("Telegram sendMessage error:", details);
    return jsonResponse({ error: "Telegram message failed" }, 502);
  }
  const { error: insertError } = await dataClient.database.from("telegram_messages").insert([{
    quote_id: quoteId,
    telegram_chat_id: chatId,
    direction: "outbound",
    message_text: cleanMessage
  }]);
  if (insertError) {
    console.error("Error saving outbound Telegram message:", insertError);
    return jsonResponse({ error: "Message sent, but history could not be saved" }, 500);
  }
  return jsonResponse({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
