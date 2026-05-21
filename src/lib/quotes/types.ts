// Tipos estructurados para cotizaciones

export type ServiceType = 
  | 'buy-phone'
  | 'setup-phone'
  | 'tech-support'
  | 'pc-build'
  | 'laptop-advice'
  | 'simple-web'
  | 'business-digital'
  | 'basic-security'
  | 'other';

export type AttentionType = 'presencial' | 'remota' | 'notsure';

export type QuoteStatus = 'pending' | 'reviewed' | 'contacted' | 'accepted' | 'rejected' | 'completed';

export interface Quote {
  id?: string;
  full_name: string;
  phone: string;
  email?: string;
  city: string;
  attention_type: AttentionType;
  service_type: ServiceType;
  urgency: 'today' | 'week' | 'norush';
  source: string;
  description: string;
  budget?: string;
  status: QuoteStatus;
  created_at?: string;
}

// Interfaz para la futura función de IA
export interface AIPreQuoteResult {
  suggestedService: ServiceType | null;
  suggestedAttention: AttentionType | null;
  missingQuestions: string[];
  priceRange: string | null;
  risksOrWarnings: string[];
}
