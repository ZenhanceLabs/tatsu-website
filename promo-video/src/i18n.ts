export type Lang = 'ja' | 'en' | 'ko';

export interface SequenceTexts {
  // TatsuSequenceStudy captions
  captionTask: string;
  captionFeature: string;
  // OpeningFlowStudy
  openingTagline: string;
  // EndingInstallStudy
  endingTitle: string;
  endingSub: string;
  // FeatureTriptychStudy - mode names
  modeFree: string;
  modeStrict: string;
  modeBuddy: string;
  // Day labels (shared)
  dayLabels: string[];
  // TaskNoiseStudy - task rules
  taskRules: string[];
  // CaptionOverlay font
  fontFamily: string;
}

export const SEQ_TEXTS: Record<Lang, SequenceTexts> = {
  ja: {
    captionTask: 'TATSU-AI のタスクをこなすだけで、利用時間を削減',
    captionFeature: 'さまざまな機能で、デジタルデトックスをサポート',
    openingTagline: 'がんばらなくていいデジタルデトックス',
    endingTitle: 'インストールして、\nあとは任せる。',
    endingSub: 'デジタルデトックスを、気合いではなく仕組みで始める。',
    modeFree: 'ふつうに制限',
    modeStrict: 'がっちり制限',
    modeBuddy: 'バディと制限',
    dayLabels: ['月', '火', '水', '木', '金', '土', '日'],
    taskRules: ['1日60分まで', '起動前に10秒待機', '22時以降は停止', '起動回数を制限', '30分で終了', '通知からは開かない'],
    fontFamily: '"Noto Sans JP", sans-serif',
  },
  en: {
    captionTask: 'Just complete TATSU-AI tasks to reduce your screen time',
    captionFeature: 'Packed with features to support your digital detox',
    openingTagline: 'Digital detox, no willpower needed',
    endingTitle: 'Install it.\nLeave the rest to TATSU.',
    endingSub: 'Start your digital detox with a system, not willpower.',
    modeFree: 'Standard',
    modeStrict: 'Strict',
    modeBuddy: 'Buddy',
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    taskRules: ['60 min/day limit', '10s delay before launch', 'Block after 10 PM', 'Limit launch count', 'End after 30 min', 'No opening from notifications'],
    fontFamily: '"Noto Sans", sans-serif',
  },
  ko: {
    captionTask: 'TATSU-AI 과제를 수행하는 것만으로 사용 시간 절감',
    captionFeature: '다양한 기능으로 디지털 디톡스를 서포트',
    openingTagline: '노력 없이도 되는 디지털 디톡스',
    endingTitle: '설치하고,\n나머지는 맡기세요.',
    endingSub: '디지털 디톡스를, 의지가 아닌 시스템으로 시작하세요.',
    modeFree: '기본 제한',
    modeStrict: '강력 제한',
    modeBuddy: '버디 제한',
    dayLabels: ['월', '화', '수', '목', '금', '토', '일'],
    taskRules: ['하루 60분 제한', '실행 전 10초 대기', '22시 이후 차단', '실행 횟수 제한', '30분 후 종료', '알림에서 열지 않기'],
    fontFamily: '"Noto Sans KR", sans-serif',
  },
};

// Also keep the TatsuPromo texts
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
