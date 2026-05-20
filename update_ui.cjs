const fs = require('fs');

const path = 'src/i18n/ui.ts';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  {
    lang: 'en',
    target: /'areas\.badge': 'Coverage',[\s\S]*?'areas\.remote\.desc': 'All of Mexico and beyond — anywhere with internet\.',/m,
    replacement: `'areas.badge': 'Coverage',
    'areas.title': 'Where I work',
    'areas.subtitle': 'Local presence, remote reach.',
    'areas.local.title': 'In-Person Support',
    'areas.local.desc': 'In-person support is available exclusively in these areas, depending on the type of service, schedule, and availability.',
    'areas.local.cities': 'Jaral del Progreso|Valle de Santiago|Cortazar|Celaya',
    'areas.remote.title': 'Remote Support',
    'areas.remote.desc': 'For other locations, I can provide remote support via WhatsApp, video call, AnyDesk, step-by-step instructions, or by reviewing information sent by the client.',
    'areas.notice.title': 'Before Scheduling',
    'areas.notice.desc': 'Not all problems can be resolved remotely. If the equipment requires physical inspection, we will evaluate if in-person service is possible.',`
  },
  {
    lang: 'es',
    target: /'areas\.badge': 'Cobertura',[\s\S]*?'areas\.remote\.desc': 'Todo México y más allá — donde haya internet\.',/m,
    replacement: `'areas.badge': 'Zonas de atención',
    'areas.title': 'Dónde trabajo',
    'areas.subtitle': 'Presencia local, alcance remoto.',
    'areas.local.title': 'Atención presencial',
    'areas.local.desc': 'La atención presencial está disponible únicamente en estas zonas, dependiendo del tipo de servicio, horario y disponibilidad.',
    'areas.local.cities': 'Jaral del Progreso|Valle de Santiago|Cortazar|Celaya',
    'areas.remote.title': 'Atención remota',
    'areas.remote.desc': 'Para otros lugares, puedo apoyar de forma remota por WhatsApp, videollamada, AnyDesk, instrucciones paso a paso o revisión de información enviada por el cliente.',
    'areas.notice.title': 'Antes de agendar',
    'areas.notice.desc': 'No todos los problemas se pueden resolver de forma remota. Si el equipo requiere revisión física, se evaluará si es posible atenderlo presencialmente.',`
  },
  {
    lang: 'ko',
    target: /'areas\.badge': '서비스 지역',[\s\S]*?'areas\.remote\.desc': '멕시코 전역 및 그 너머 — 인터넷이 되는 곳 어디든\.',/m,
    replacement: `'areas.badge': '서비스 지역',
    'areas.title': '근무 지역',
    'areas.subtitle': '지역 현장, 원격 서비스.',
    'areas.local.title': '대면 지원',
    'areas.local.desc': '대면 지원은 서비스 유형, 일정 및 가능 여부에 따라 이 지역에서만 독점적으로 제공됩니다.',
    'areas.local.cities': 'Jaral del Progreso|Valle de Santiago|Cortazar|Celaya',
    'areas.remote.title': '원격 지원',
    'areas.remote.desc': '다른 지역의 경우 WhatsApp, 화상 통화, AnyDesk, 단계별 지침 또는 고객이 보낸 정보를 검토하여 원격 지원을 제공할 수 있습니다.',
    'areas.notice.title': '예약 전',
    'areas.notice.desc': '모든 문제를 원격으로 해결할 수 있는 것은 아닙니다. 장비에 대한 물리적 검사가 필요한 경우 대면 서비스가 가능한지 평가합니다.',`
  },
  {
    lang: 'ja',
    target: /'areas\.badge': 'エリア',[\s\S]*?'areas\.remote\.desc': 'メキシコ全土とその先 — インターネットがある場所どこでも\.',/m,
    replacement: `'areas.badge': 'エリア',
    'areas.title': '対応エリア',
    'areas.subtitle': '地域密着、リモート対応。',
    'areas.local.title': '対面サポート',
    'areas.local.desc': '対面サポートは、サービスの種類、スケジュール、および対応状況に応じて、これらのエリアでのみ排他的に利用できます。',
    'areas.local.cities': 'Jaral del Progreso|Valle de Santiago|Cortazar|Celaya',
    'areas.remote.title': 'リモートサポート',
    'areas.remote.desc': '他の地域については、WhatsApp、ビデオ通話、AnyDesk、段階的な指示、またはクライアントから送信された情報の確認を通じてリモートサポートを提供できます。',
    'areas.notice.title': 'スケジュール前',
    'areas.notice.desc': 'すべての問題がリモートで解決できるわけではありません。機器に物理的な検査が必要な場合は、対面でのサービスが可能かどうかを評価します。',`
  }
];

replacements.forEach(r => {
  content = content.replace(r.target, r.replacement);
});

fs.writeFileSync(path, content, 'utf8');
console.log('Updated ui.ts successfully');
