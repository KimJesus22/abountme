const serviceTypeLabels: Record<string, string> = {
  'business-digital': 'Digitalización para negocio',
  'phone-advice': 'Asesoría para comprar celular',
  'buy-phone': 'Asesoría para comprar celular',
  'phone-setup': 'Configuración de celular nuevo',
  'setup-phone': 'Configuración de celular nuevo',
  'tech-support': 'Soporte técnico básico',
  'pc-laptop': 'PC / Laptop',
  'pc-build': 'PC / Laptop',
  'laptop-advice': 'PC / Laptop',
  website: 'Página web',
  'simple-web': 'Página web',
  security: 'Seguridad digital básica',
  'basic-security': 'Seguridad digital básica',
  other: 'Otro',
};

const attentionTypeLabels: Record<string, string> = {
  remote: 'Remota',
  remota: 'Remota',
  presential: 'Presencial',
  presencial: 'Presencial',
  notsure: 'No estoy seguro',
};

export function formatServiceType(value: unknown) {
  const key = String(value || '').trim();
  return serviceTypeLabels[key] || key || '-';
}

export function formatAttentionType(value: unknown) {
  const key = String(value || '').trim();
  return attentionTypeLabels[key] || key || '-';
}
