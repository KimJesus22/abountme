import type { AIPreQuoteResult } from './types';

/**
 * Función preparada para la futura integración de Inteligencia Artificial (OpenAI / OpenRouter).
 * El objetivo será analizar la descripción del problema que escribe el usuario para sugerirle
 * automáticamente el tipo de servicio, el rango de precio, si debe ser presencial/remoto,
 * y qué preguntas clave faltaron en su descripción.
 * 
 * NOTA: Aún no conecta a ninguna API. Es un cascarón arquitectónico.
 */
export async function analyzeQuoteWithAI(description: string): Promise<AIPreQuoteResult | null> {
  if (!description || description.trim().length < 10) {
    return null;
  }

  // TODO: Implementar llamada real a OpenRouter/InsForge AI aquí en el futuro.
  // Ejemplo simulado de lo que devolvería la IA:
  /*
  return {
    suggestedService: 'pc-build',
    suggestedAttention: 'presencial',
    priceRange: 'Desde $500 MXN',
    missingQuestions: ['¿Qué modelo exacto de procesador tienes?', '¿De cuántos Watts es tu fuente de poder?'],
    risksOrWarnings: ['Si la fuente de poder es genérica, es riesgoso agregar una tarjeta de video nueva.']
  };
  */

  return null;
}
