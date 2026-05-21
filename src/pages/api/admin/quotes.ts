import type { APIRoute } from 'astro';
import { createClient } from '@insforge/sdk';

const insforgeUrl = import.meta.env.PUBLIC_INSFORGE_URL;
const insforgeAnonKey = import.meta.env.PUBLIC_INSFORGE_ANON_KEY;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function isAdminReferer(request: Request) {
  const referer = request.headers.get('referer');
  if (!referer) return false;

  try {
    const refererUrl = new URL(referer);
    const requestUrl = new URL(request.url);
    return refererUrl.origin === requestUrl.origin && refererUrl.pathname.startsWith('/admin');
  } catch {
    return false;
  }
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!isAdminReferer(request)) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }

  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const adminClient = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey,
    edgeFunctionToken: accessToken,
  });

  const { data: authData, error: authError } = await adminClient.auth.getCurrentUser();
  if (authError || !authData?.user) {
    console.error('[admin:quotes] Unauthorized request', { authError });
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const dataClient = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey,
  });

  const { data, error } = await dataClient.database
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin:quotes] Error loading quotes', error);
    return jsonResponse({ error: 'No se pudieron cargar las cotizaciones.' }, 500);
  }

  return jsonResponse({ quotes: data || [] });
};
