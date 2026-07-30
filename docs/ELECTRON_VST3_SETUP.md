# Electron VST3 Plugin Setup

このドキュメントでは、ReAudio を Electron ラッパーでネイティブ VST3 プラグインとして配布する方法を説明します。

## 📋 概要

ReAudio はWeb Audio APIベースのオーディオフレームワークです。Electronを使用することで、これをネイティブVST3プラグインとして DAW に統合できます。

**アーキテクチャ:**
```
DAW (Cubase, Studio One, etc.)
    ↓
VST3 Host Interface
    ↓
Electron Main Process
    ↓
Web Audio API (JavaScript)
    ↓
Audio Processing (React Components)
```

## 🚀 セットアップ手順

### ステップ 1: 依存関係のインストール

```bash
pnpm install
```

### ステップ 2: 開発モードでテスト

```bash
# Electron + Vite のホットリロードで開発
pnpm electron:dev
```

このコマンドで：
- Vite がデモアプリをビルド（ポート 5173）
- TypeScript がリアルタイムコンパイル
- Electron がアプリをロード

### ステップ 3: VST3 プラグインのビルド

```bash
pnpm build:vst3
```

出力:
- `dist/vst3/` - VST3 プラグインバンドル
- `dist/vst3/bundle.json` - メタデータ
- `dist/vst3/vst3.json` - VST3 設定

## 📦 ネイティブプラグイン配布

### Windows (.vst3)

```bash
pnpm --filter @reaudio/electron-vst dist
```

出力: `ReAudio-0.1.0.exe` (インストーラー)

インストール後、以下のパスに配置：
```
C:\Program Files\Common Files\VST3\
```

### macOS (.vst3)

```bash
pnpm --filter @reaudio/electron-vst dist
```

出力: `ReAudio-0.1.0.dmg`

インストール後：
```
~/Library/Audio/Plug-Ins/VST3/
```

### Linux (.vst3)

```bash
pnpm --filter @reaudio/electron-vst dist
```

出力: `ReAudio-0.1.0.AppImage`

インストール後：
```
~/.vst3/
```

## 🔧 ディレクトリ構成

```
packages/electron-vst/
├── src/
│   ├── main.ts          # Electron メインプロセス
│   └── preload.ts       # Preload スクリプト (セキュリティ)
├── package.json         # electron-builder 設定含む
└── tsconfig.json

examples/demo-plugin/   # React UI コンポーネント
dist/
├── vst/                 # Web Audio バンドル
└── vst3/                # VST3 メタデータ
```

## 🎛️ VST3 Bridge IPC

Electron IPC を通じて VST3 ホストと通信します。

### 利用可能なIPC ハンドラー

**`vst:getInfo`**
```typescript
const info = await window.electronAPI.vst.getInfo();
// {
//   name: 'ReAudio VST3',
//   version: '0.1.0',
//   vendor: 'ReAudio',
//   uid: 0x52654155
// }
```

**`vst:sendMidi`**
```typescript
await window.electronAPI.vst.sendMidi(
  0x90,  // Note On status
  60,    // Note number (C4)
  100    // Velocity
);
```

## 📊 ビルドパイプライン

```
pnpm build:vst3
    ↓
turbo build (全パッケージコンパイル)
    ↓
node scripts/build-vst3.js (メタデータ生成)
    ↓
dist/vst3/
    ├── index.html
    ├── assets/index-*.js
    ├── bundle.json
    └── vst3.json
```

## 🐛 トラブルシューティング

### Electron が起動しない

```bash
# キャッシュクリア
rm -rf node_modules/.vite
pnpm install
pnpm electron:dev
```

### VST3 プラグインが認識されない

1. プラグインフォルダを確認：
   - Windows: `C:\Program Files\Common Files\VST3\`
   - macOS: `~/Library/Audio/Plug-Ins/VST3/`
   - Linux: `~/.vst3/`

2. DAW を再起動してプラグインスキャン実行

3. コンソールエラーを確認：
   ```bash
   pnpm --filter @reaudio/electron-vst electron
   ```

### パフォーマンス の最適化

- `examples/demo-plugin/vite.config.ts` で最適化設定を調整
- Web Audio の Sample Rate を DAW と同期
- バッファサイズは DAW 設定に従う

## 📈 次のステップ

- [ ] VST3 パラメーター自動化の実装
- [ ] MIDI データローカライズ最適化
- [ ] レイテンシー測定と改善
- [ ] オーディオ処理パイプラインの拡張
- [ ] CI/CD での自動ビルド・署名

## 🔗 参考資料

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [VST3 Specification](https://www.steinberg.net/en/company/developers.html)
- [Web Audio API](https://www.w3.org/TR/webaudio/)
