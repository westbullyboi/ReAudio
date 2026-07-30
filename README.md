# ReAudio

ReAudio は、TypeScript、Vite、および React を使用して構築された Web Audio VST 開発フレームワークです。Web Audio API を活用し、モジュール化された現代的で型安全なオーディオプラグインおよび Web オーディオアプリケーションの開発をサポートします。

---

## 主な機能 (Features)

- 📦 **モノレポ アーキテクチャ**: pnpm / npm ワークスペースによる、コア DSP パッケージと React 統合パッケージの分離
- 🛡️ **TypeScript 完全サポート**: strict モードおよび型安全な Web Audio API / AudioWorklet インターフェース
- 🎵 **AudioWorklet サポート**: 低レイテンシーオーディオ処理のための基盤と型定義を提供
- ⚛️ **React 統合**: AudioContext ライフサイクル管理、Autoplay 対応、オーディオパラメータ用カスタムフック (`AudioProvider`, `useAudioContext`, `useAudioParam`)
- ⚡ **Vite による高速開発**: 高速な開発環境とビルドパイプライン

---

## ディレクトリ構造 (Directory Structure)

```text
ReAudio/
├── packages/
│   ├── core/          # Core DSP & AudioWorklet 処理パッケージ (@reaudio/core)
│   └── react/         # React コンポーネントおよびフック (@reaudio/react)
├── examples/
│   └── demo-plugin/   # サンプル Web Audio プラグインアプリケーション
└── package.json       # ルート構成・スクリプトファイル
```

---

## パッケージ概要 (Packages)

### `@reaudio/core`
DSP 処理および AudioWorklet 処理を担当するコアパッケージです。
- `BaseAudioWorkletProcessor`: オーディオ入力を出力へパススルー・加工処理を行う AudioWorkletProcessor の基底クラス
- `AudioWorkletNodeWrapper`: 安全なパラメータ取得 (`getParameter`) 機能を備えた AudioWorkletNode のラッパークラス

### `@reaudio/react`
Web Audio API を React アプリケーションに統合するためのコンポーネントとフックを提供します。
- `AudioProvider`: AudioContext の作成・ライフサイクル管理（自動再開・アンマウント時クリーンアップ・Autoplayポリシー対応）を提供する Context Provider
- `useAudioContext`: アプリケーション内で AudioContext の参照や初期化・再開関数を取得するためのカスタムフック
- `useAudioParam`: `AudioParam` の値を安全かつ高効率に操作・同期するためのカスタムフック

---

## 開発とセットアップ (Getting Started)

### 前提条件 (Prerequisites)

- **Node.js**: 18.0.0 以上
- **パッケージマネージャー**: npm または pnpm (9.0.0+)

### インストール (Installation)

依存関係のインストール:

```bash
npm install
# または pnpm install
```

### ビルド (Build)

全パッケージの型チェックおよびビルド:

```bash
# パッケージのビルド
npx tsc -p packages/core/tsconfig.json
npx tsc -p packages/react/tsconfig.json

# プロジェクト全体のビルド
npm run build
```

---

## 使い方・サンプルコード (Usage Examples)

### 1. `AudioProvider` による AudioContext のセットアップ

アプリケーションのルートで `AudioProvider` をラップします。

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AudioProvider } from '@reaudio/react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
);
```

### 2. `useAudioContext` によるコンテキスト状態の取得・操作

```tsx
import React from 'react';
import { useAudioContext } from '@reaudio/react';

export function AudioStatus() {
  const { audioContext, isInitialized, initialize, resume } = useAudioContext();

  return (
    <div>
      <p>初期化状態: {isInitialized ? '初期化済み' : '未初期化'}</p>
      {audioContext && <p>サンプルレート: {audioContext.sampleRate} Hz</p>}
      
      {!audioContext ? (
        <button onClick={() => initialize()}>AudioContext を初期化</button>
      ) : audioContext.state === 'suspended' ? (
        <button onClick={() => resume()}>AudioContext を再開</button>
      ) : null}
    </div>
  );
}
```

### 3. `useAudioParam` によるオーディオパラメータの操作

```tsx
import React from 'react';
import { useAudioParam } from '@reaudio/react';

interface GainSliderProps {
  gainParam: AudioParam | null;
}

export function GainSlider({ gainParam }: GainSliderProps) {
  const [gain, setGain] = useAudioParam(gainParam, {
    minValue: 0,
    maxValue: 1,
    defaultValue: 0.8,
  });

  return (
    <div>
      <label>Gain: {gain.toFixed(2)}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={gain}
        onChange={(e) => setGain(parseFloat(e.target.value))}
      />
    </div>
  );
}
```

---

## ライセンス (License)

MIT License