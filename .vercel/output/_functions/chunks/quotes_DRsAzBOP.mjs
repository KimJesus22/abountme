import { createClient } from '@insforge/sdk';

const insforgeUrl = "https://ckde3c4f.us-east.insforge.app";
const insforgeAnonKey = "ik_5d51a851dab9aef6bcfa5b4d45f345d8";
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
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
const GET = async ({ request }) => {
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
    console.error("[admin:quotes] Unauthorized request", { authError });
    return jsonResponse({ error: "Unauthorized" }, 401);
  }
  const dataClient = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey
  });
  const { data, error } = await dataClient.database.from("quotes").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("[admin:quotes] Error loading quotes", error);
    return jsonResponse({ error: "No se pudieron cargar las cotizaciones." }, 500);
  }
  return jsonResponse({ quotes: data || [] });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
