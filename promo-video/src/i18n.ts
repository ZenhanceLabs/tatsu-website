export type Lang = 'ja' | 'en' | 'ko';

export interface PromoTexts {
  taskLimit: string;
  dayLabels: string[];
  total: string;
  totalUsageTime: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

export const PROMO_TEXTS: Record<Lang, PromoTexts> = {
  ja: {
    taskLimit: '1日60分まで',
    dayLabels: ['月', '火', '水', '木', '金', '土', '日'],
    total: '合計',
    totalUsageTime: '合計使用時間',
    ctaTitle: '受動的デジタルデトックス',
    ctaSubtitle: '受動的デジタルデトックス',
    ctaButton: 'Google Playで手に入れる',
  },
  en: {
    taskLimit: '60 min/day limit',
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    total: 'Total',
    totalUsageTime: 'Total Screen Time',
    ctaTitle: 'Passive Digital Detox',
    ctaSubtitle: 'Passive digital detox',
    ctaButton: 'Get it on Google Play',
  },
  ko: {
    taskLimit: '하루 60분 제한',
    dayLabels: ['월', '화', '수', '목', '금', '토', '일'],
    total: '합계',
    totalUsageTime: '총 사용 시간',
    ctaTitle: '수동적 디지털 디톡스',
    ctaSubtitle: '수동적 디지털 디톡스',
    ctaButton: 'Google Play에서 다운로드',
  },
};

export const getFontStack = (lang: Lang): string => {
  switch (lang) {
    case 'ja': return '"Noto Sans JP", "Segoe UI", sans-serif';
    case 'en': return '"Noto Sans", "Segoe UI", sans-serif';
    case 'ko': return '"Noto Sans KR", "Segoe UI", sans-serif';
  }
};
