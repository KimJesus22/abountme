const fs = require('fs');

const path = 'src/i18n/ui.ts';
let content = fs.readFileSync(path, 'utf8');

const keysToAdd = {
  en: `    'quote.city': 'City or community',
    'quote.budget': 'Approximate budget (optional)',
    'quote.attention': 'Type of attention',
    'quote.attention.inperson': 'In-Person',
    'quote.attention.remote': 'Remote',
    'quote.attention.notsure': 'Not sure',
    'quote.urgency': 'Urgency',
    'quote.urgency.today': 'Today',
    'quote.urgency.week': 'This week',
    'quote.urgency.norush': 'No rush',
    'quote.source': 'Where did you hear about me?',
    'quote.source.ciber': 'Ciber La Red',
    'quote.source.oxxo': 'OXXO / GTO Digital Kiosks',
    'quote.source.recommend': 'Recommendation',
    'quote.source.facebook': 'Facebook',
    'quote.source.whatsapp': 'WhatsApp',
    'quote.source.github': 'GitHub / Portfolio',
    'quote.source.other': 'Other',`,
  
  es: `    'quote.city': 'Ciudad o comunidad',
    'quote.budget': 'Presupuesto aproximado (opcional)',
    'quote.attention': 'Tipo de atención',
    'quote.attention.inperson': 'Presencial',
    'quote.attention.remote': 'Remota',
    'quote.attention.notsure': 'No estoy seguro',
    'quote.urgency': 'Urgencia',
    'quote.urgency.today': 'Hoy',
    'quote.urgency.week': 'Esta semana',
    'quote.urgency.norush': 'Sin prisa',
    'quote.source': '¿Dónde escuchaste de mí?',
    'quote.source.ciber': 'Ciber La Red',
    'quote.source.oxxo': 'OXXO / Kioscos Digitales GTO',
    'quote.source.recommend': 'Recomendación',
    'quote.source.facebook': 'Facebook',
    'quote.source.whatsapp': 'WhatsApp',
    'quote.source.github': 'GitHub / portafolio',
    'quote.source.other': 'Otro',`,
    
  ko: `    'quote.city': '도시 또는 지역 사회',
    'quote.budget': '예산 (선택 사항)',
    'quote.attention': '주의 유형',
    'quote.attention.inperson': '대면',
    'quote.attention.remote': '원격',
    'quote.attention.notsure': '확실하지 않음',
    'quote.urgency': '긴급',
    'quote.urgency.today': '오늘',
    'quote.urgency.week': '이번 주',
    'quote.urgency.norush': '서두르지 않음',
    'quote.source': '어디서 제 이야기를 들으셨나요?',
    'quote.source.ciber': 'Ciber La Red',
    'quote.source.oxxo': 'OXXO / GTO 디지털 키오스크',
    'quote.source.recommend': '추천',
    'quote.source.facebook': '페이스북',
    'quote.source.whatsapp': 'WhatsApp',
    'quote.source.github': 'GitHub / 포트폴리오',
    'quote.source.other': '기타',`,
    
  ja: `    'quote.city': '都市またはコミュニティ',
    'quote.budget': '概算予算（任意）',
    'quote.attention': '対応タイプ',
    'quote.attention.inperson': '対面',
    'quote.attention.remote': 'リモート',
    'quote.attention.notsure': 'わからない',
    'quote.urgency': '緊急度',
    'quote.urgency.today': '今日',
    'quote.urgency.week': '今週',
    'quote.urgency.norush': '急がない',
    'quote.source': 'どこで私を知りましたか？',
    'quote.source.ciber': 'Ciber La Red',
    'quote.source.oxxo': 'OXXO / GTO デジタルキオスク',
    'quote.source.recommend': '推薦',
    'quote.source.facebook': 'Facebook',
    'quote.source.whatsapp': 'WhatsApp',
    'quote.source.github': 'GitHub / ポートフォリオ',
    'quote.source.other': 'その他',`
};

const successReplacement = {
  en: "'quote.success': 'Thank you, I received your request. I will contact you to review your case and tell you if I can help you in person or remotely.',",
  es: "'quote.success': 'Gracias, recibí tu solicitud. Te contactaré para revisar tu caso y decirte si puedo ayudarte de forma presencial o remota.',",
  ko: "'quote.success': '감사합니다. 요청을 받았습니다. 사례를 검토하고 대면 또는 원격으로 도움을 드릴 수 있는지 알려드리기 위해 연락드리겠습니다.',",
  ja: "'quote.success': 'ありがとうございます、リクエストを受け取りました。あなたのケースを確認し、対面またはリモートでお手伝いできるかどうかをお知らせするためにご連絡いたします。',"
};

Object.keys(keysToAdd).forEach(lang => {
  // Insert keys after quote.name
  const regex = new RegExp("(\\\\s*'quote\\\\.name':\\\\s*'.*?',)");
  content = content.replace(regex, "$1\\n" + keysToAdd[lang]);
  
  // Replace success message
  const successRegex = new RegExp("\\\\s*'quote\\\\.success':\\\\s*'.*?',");
  content = content.replace(successRegex, "\\n    " + successReplacement[lang]);
});

fs.writeFileSync(path, content, 'utf8');
