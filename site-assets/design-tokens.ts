/**
 * Zenhance Design Tokens
 *
 * サイト制作時にそのまま流用できるデザイントークン集。
 * Tailwind CSS の extend に入れるか、CSS 変数として定義してください。
 */

// ============================================
// Typography
// ============================================

export const typography = {
  h1: { fontSize: 36, lineHeight: 44, fontWeight: 700, letterSpacing: -0.5 },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: 700, letterSpacing: -0.3 },
  h3: { fontSize: 22, lineHeight: 28, fontWeight: 700 },
  h4: { fontSize: 18, lineHeight: 24, fontWeight: 700 },

  bodyLarge: { fontSize: 18, lineHeight: 28, fontWeight: 400 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: 400 },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: 400 },

  label: { fontSize: 14, lineHeight: 20, fontWeight: 600 },
  labelSmall: { fontSize: 12, lineHeight: 16, fontWeight: 600 },

  button: { fontSize: 16, lineHeight: 24, fontWeight: 700 },
  buttonSmall: { fontSize: 14, lineHeight: 20, fontWeight: 600 },

  caption: { fontSize: 12, lineHeight: 16, fontWeight: 500 },
  captionSmall: { fontSize: 10, lineHeight: 14, fontWeight: 500 },
} as const;

// ============================================
// Spacing
// ============================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

// ============================================
// Border Radius
// ============================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,  // ← カード標準
  full: 9999,
} as const;

// ============================================
// Shadows (Web 用)
// ============================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 2px 8px rgba(0,0,0,0.08)',
  lg: '0 4px 12px rgba(0,0,0,0.10)',
  xl: '0 8px 24px rgba(0,0,0,0.15)',
} as const;

// ============================================
// Light Theme Colors
// ============================================

export const lightColors = {
  // 背景
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',

  // テキスト
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',

  // ブランド
  accent: '#6366f1',
  accentLight: '#eef2ff',
  accentDark: '#4338ca',

  // セマンティック
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',

  // ボーダー
  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  // カード
  cardBackground: '#ffffff',
  cardBorder: 'rgba(0, 0, 0, 0.08)', // 実際の描画色

  // グラフ
  chartPrimary: '#6366f1',
  chartSecondary: '#818cf8',
  chartTertiary: '#a5b4fc',
  chartSuccess: '#10b981',
  chartOther: '#e2e8f0',
} as const;

// ============================================
// Dark Theme Colors
// ============================================

export const darkColors = {
  // 背景
  background: '#0f172a',
  surface: '#1e293b',
  surfaceAlt: '#475569',

  // テキスト
  textPrimary: '#FFFFFF',
  textSecondary: '#EEEEEE',
  textMuted: '#EEEEEE',
  textInverse: '#0f172a',

  // ブランド
  accent: '#818cf8',
  accentLight: '#4f46e5',
  accentDark: '#a5b4fc',

  // セマンティック
  success: '#39ff14',
  successLight: '#064e3b',
  warning: '#ffea00',
  warningLight: '#78350f',
  danger: '#ff5555',
  dangerLight: '#7f1d1d',

  // ボーダー
  border: '#475569',
  borderLight: '#334155',

  // カード
  cardBackground: '#1e293b',
  cardBorder: 'rgba(255, 255, 255, 0.10)',

  // グラフ
  chartPrimary: '#818cf8',
  chartSecondary: '#a5b4fc',
  chartTertiary: '#6366f1',
  chartSuccess: '#39ff14',
  chartOther: '#475569',
} as const;

// ============================================
// Easing (Framer Motion 用)
// ============================================

export const easings = {
  /** 棒グラフ・折れ線グラフの成長アニメーション */
  chart: [0.25, 0.1, 0.25, 1] as const,
  /** 汎用イージング */
  default: [0.4, 0, 0.2, 1] as const,
} as const;

export const durations = {
  barChart: 0.7,   // 700ms
  lineChart: 0.8,  // 800ms
  card: 0.3,       // 300ms
  tooltip: 0.15,   // 150ms
} as const;
