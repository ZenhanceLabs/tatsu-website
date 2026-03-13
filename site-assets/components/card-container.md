# カードコンテナ (Card Container)

**ソース:** 各カードコンポーネント共通パターン

## 概要

アプリ全体で統一されたカードスタイル。
すべてのカードはこの基本スタイルに従う。

## 基本スタイル

```css
.card {
  background-color: var(--card-background);
  border-radius: 24px;
  padding: 20px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--card-border);
}
```

## テーマ別の色

### ライトモード

| プロパティ | 値 |
|---|---|
| backgroundColor | `#ffffff` |
| borderColor | `rgba(0, 0, 0, 0.08)` |

### ダークモード

| プロパティ | 値 |
|---|---|
| backgroundColor | `#1e1e2e` |
| borderColor | `rgba(255, 255, 255, 0.10)` |

## 重要な設計判断

### シャドウを使わない

このアプリでは **シャドウ (box-shadow / elevation) を使わない**。
カードの境界は `borderWidth: 1` の薄いボーダーで表現する。

理由:
- ダークモードでシャドウが見えにくい
- フラットで統一感のあるデザイン
- パフォーマンス (特にRN Androidでのshadow描画負荷回避)

### border-radius: 24 を統一

すべてのカードで `borderRadius: 24` を使用。
内部の要素 (ボタン、バッジなど) は別の値を使うが、
外枠は必ず 24。

## React (Framer Motion) での実装例

```tsx
import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <motion.div
      className={`
        bg-white dark:bg-[#1e1e2e]
        border border-black/8 dark:border-white/10
        rounded-[24px] p-5
        ${className ?? ""}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
```

## Tailwind CSS クラス対応

| RN スタイル | Tailwind クラス |
|---|---|
| `borderRadius: 24` | `rounded-[24px]` |
| `padding: 20` | `p-5` |
| `borderWidth: 1` | `border` |
| `borderColor: rgba(0,0,0,0.08)` | `border-black/8` |
| `borderColor: rgba(255,255,255,0.10)` | `dark:border-white/10` |
| `backgroundColor: #ffffff` | `bg-white` |
| `backgroundColor: #1e1e2e` | `dark:bg-[#1e1e2e]` |

## カード間の余白

| 使用箇所 | gap |
|---|---|
| 分析画面 (縦並び) | 16px (`gap-4`) |
| ホーム画面 (縦並び) | 16px (`gap-4`) |
| 設定画面 | 12px (`gap-3`) |

## カード内のセクション分割

セクション間の区切りには:

```css
.divider {
  border-top: 1px solid var(--border);
  margin-top: 16px;
  padding-top: 16px;
}
```

| ライトモード | `rgba(0, 0, 0, 0.06)` |
| ダークモード | `rgba(255, 255, 255, 0.08)` |
