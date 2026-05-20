const fs = require('fs');

const path = 'src/i18n/ui.ts';
let content = fs.readFileSync(path, 'utf8');

const newKeys = {
  en: `    'hardware.badge': 'PCs, Laptops & Upgrades',
    'hardware.title': 'PC Building & Upgrades',
    'hardware.subtitle': 'I can also help you if you want to build a PC, upgrade a laptop, or check if a used device is worth it.',
    'hardware.story': 'I have built my own gaming PC picking parts from DDTech and bought a used laptop on Marketplace to upgrade it: I went from 8 GB to 16 GB of RAM and from a 256 GB to a 1 TB SSD.',
    'hardware.disclaimer': 'I do not sell components directly. I help you choose better and avoid unnecessary or incompatible purchases.',
    'hardware.button': 'Get a quote for upgrade or build',
    'hardware.feature.1': 'Guidance to build a PC by budget',
    'hardware.feature.2': 'Component compatibility check',
    'hardware.feature.3': 'RAM and storage upgrades',
    'hardware.feature.4': 'Review of used laptops before buying',
    'hardware.feature.5': 'Recommendations for studying, working, gaming, or basic use',
    'hardware.feature.6': 'Basic software installation/configuration',`,
  es: `    'hardware.badge': 'PCs, laptops y mejoras',
    'hardware.title': 'Armado y Mejora de Equipos',
    'hardware.subtitle': 'También puedo ayudarte si quieres armar una PC, mejorar una laptop o revisar si un equipo usado conviene.',
    'hardware.story': 'Yo mismo he armado una PC gamer eligiendo componentes en DDTech y también he comprado una laptop usada en Marketplace para mejorarla: pasé de 8 GB a 16 GB de RAM y de un SSD de 256 GB a uno de 1 TB.',
    'hardware.disclaimer': 'No vendo componentes directamente. Te ayudo a elegir mejor y evitar compras innecesarias o incompatibles.',
    'hardware.button': 'Cotizar mejora o armado',
    'hardware.feature.1': 'Orientación para armar PC por presupuesto',
    'hardware.feature.2': 'Revisión de compatibilidad de componentes',
    'hardware.feature.3': 'Mejora de RAM y almacenamiento',
    'hardware.feature.4': 'Revisión de laptops usadas antes de comprar',
    'hardware.feature.5': 'Recomendaciones para estudiar, trabajar, jugar o uso básico',
    'hardware.feature.6': 'Instalación/configuración de software básico',`,
  ko: `    'hardware.badge': 'PC, 랩톱 및 업그레이드',
    'hardware.title': 'PC 조립 및 업그레이드',
    'hardware.subtitle': 'PC를 조립하거나, 랩톱을 업그레이드하거나, 중고 기기가 살 만한지 확인하고 싶을 때 도와드릴 수 있습니다.',
    'hardware.story': '저는 DDTech에서 부품을 선택하여 제 게이밍 PC를 직접 조립했고, 마켓플레이스에서 중고 랩톱을 구입하여 업그레이드했습니다. RAM을 8GB에서 16GB로, SSD를 256GB에서 1TB로 늘렸습니다.',
    'hardware.disclaimer': '저는 부품을 직접 판매하지 않습니다. 더 나은 선택을 하고 불필요하거나 호환되지 않는 구매를 피하도록 도와드립니다.',
    'hardware.button': '업그레이드 또는 조립 견적 받기',
    'hardware.feature.1': '예산별 PC 조립 안내',
    'hardware.feature.2': '부품 호환성 확인',
    'hardware.feature.3': 'RAM 및 저장 장치 업그레이드',
    'hardware.feature.4': '구매 전 중고 랩톱 검토',
    'hardware.feature.5': '공부, 업무, 게임 또는 기본 사용을 위한 추천',
    'hardware.feature.6': '기본 소프트웨어 설치/구성',`,
  ja: `    'hardware.badge': 'PC、ノートパソコン、アップグレード',
    'hardware.title': 'PC組み立てとアップグレード',
    'hardware.subtitle': 'PCを組み立てたい、ノートパソコンをアップグレードしたい、中古デバイスが価値があるか確認したい場合もお手伝いできます。',
    'hardware.story': '私自身、DDTechで部品を選んでゲーミングPCを組み立てたり、Marketplaceで中古のノートパソコンを買ってアップグレードしたりしました。RAMを8GBから16GBに、SSDを256GBから1TBに増やしました。',
    'hardware.disclaimer': '私は部品を直接販売していません。より良い選択をし、不必要または互換性のない購入を避けるお手伝いをします。',
    'hardware.button': 'アップグレードまたは組み立ての見積もり',
    'hardware.feature.1': '予算別のPC組み立てガイダンス',
    'hardware.feature.2': '部品の互換性チェック',
    'hardware.feature.3': 'RAMとストレージのアップグレード',
    'hardware.feature.4': '購入前の中古ノートパソコンの確認',
    'hardware.feature.5': '勉強、仕事、ゲーム、または基本使用のための推奨事項',
    'hardware.feature.6': '基本ソフトウェアのインストールと設定',`
};

Object.keys(newKeys).forEach(lang => {
  const regex = new RegExp("(\\\\s*'quote\\\\.name':\\\\s*'.*?',)");
  content = content.replace(regex, "$1\\n" + newKeys[lang]);
});

fs.writeFileSync(path, content, 'utf8');
