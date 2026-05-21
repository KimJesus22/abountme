/**
 * Genera un enlace wa.me con mensaje prellenado.
 * Número en formato internacional México: 5214111441791
 */
const WHATSAPP_NUMBER = '5214111441791';

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Mensajes prellenados por sección */
export const waMessages = {
  phoneAdvice: 'Hola José, quiero asesoría para comprar un celular. Mi presupuesto aproximado es:',
  phoneSetup: 'Hola José, quiero ayuda para configurar mi celular.',
  hardware: 'Hola José, quiero ayuda para revisar, mejorar o armar una PC/laptop.',
  business: 'Hola José, quiero cotizar una solución digital para mi negocio.',
  web: 'Hola José, quiero cotizar una página web sencilla.',
  general: 'Hola José, vi tu página y me gustaría más información sobre tus servicios.',
  techSupport: 'Hola José, necesito soporte técnico.',
  security: 'Hola José, quiero ayuda con seguridad digital.',
} as const;
