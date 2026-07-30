# GitHub Actions で Electron VST3 ネイティブプラグイン自動ビルド

このガイドでは、GitHub Actions を使用して ReAudio を複数プラットフォーム（Windows、macOS、Linux）でネイティブ VST3 プラグインとして自動ビルド・配布する方法を説明します。

## 📋 概要

GitHub Actions ワークフロー（`.github/workflows/build-electron-vst3.yml`）は以下を自動実行します：

```
マージ / タグプッシュ
    ↓
GitHub Actions トリガー
    ↓
[並列ビルド]
├─ Ubuntu: AppImage 生成 (Linux VST3)
├─ Windows: .exe インストーラー生成
└─ macOS: .dmg インストーラー生成
    ↓
Artifacts アップロード
    ↓
[タグの場合] GitHub Release 作成
    └─ 全プラットフォーム版をリリースアセットに追加
```

## 🚀 使用開始

### ステップ 1: ワークフロー確認

リポジトリの `.github/workflows/build-electron-vst3.yml` が存在することを確認：

```bash
ls -la .github/workflows/build-electron-vst3.yml
```

### ステップ 2: 開発用リリース（アーティファクト）

main ブランチにプッシュすると、自動的にビルドが実行されます：

```bash
git push origin main
```

**確認場所:**
- GitHub リポジトリ → Actions → "Build Electron VST3 Plugin"
- 実行完了後、ワークフロー詳細ページで "Artifacts" セクションをクリック
- 各プラットフォーム版をダウンロード可能

### ステップ 3: 本番リリース（GitHub Release）

バージョンタグをプッシュすると、GitHub Release が自動作成されます：

```bash
git tag v0.2.0
git push origin v0.2.0
```

**結果:**
- 自動的に「Releases」ページに v0.2.0 リリースが作成
- 全プラットフォーム版の VST3 インストーラーが Assets として添付
- リリースノートが自動生成

## 📊 ワークフロー詳細

### トリガー条件

ワークフローは以下の場合に実行されます：

```yaml
on:
  push:
    branches: [main]  # main ブランチへのプッシュ
    paths:            # これらのファイル変更時のみ
      - 'packages/**'
      - 'examples/demo-plugin/**'
      - '.github/workflows/build-electron-vst3.yml'
  
  pull_request:
    branches: [main]  # PR テスト用

  workflow_dispatch:  # 手動実行（GitHub UI から）
```

### ジョブ構成

#### **Build ジョブ（3 並列実行）**

| OS | 出力 | インストール先 |
|----|------|------------|
| **Ubuntu** | `.AppImage` | `~/.vst3/` |
| **Windows** | `.exe` | `C:\Program Files\Common Files\VST3\` |
| **macOS** | `.dmg` | `~/Library/Audio/Plug-Ins/VST3/` |

各ジョブは独立して実行され、プラットフォーム固有の設定が自動適用されます。

#### **Release ジョブ**

タグプッシュ時（`refs/tags/v*`）のみ実行：
- 全プラットフォーム版アーティファクトをダウンロード
- GitHub Release を自動作成
- リリースノート自動生成

## 🔧 カスタマイズ

### ビルド条件を変更

`build-electron-vst3.yml` の `paths` セクション：

```yaml
paths:
  - 'packages/**'           # これらのパスを監視
  - 'examples/demo-plugin/**'
  - '.github/workflows/build-electron-vst3.yml'
  # 追加例:
  # - 'docs/CHANGELOG.md'   # ドキュメント更新時にもビルド
```

### Node.js バージョン変更

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '24'  # ここを変更
```

### キャッシュ設定

pnpm キャッシュを無効化：

```yaml
- name: Setup pnpm cache
  uses: actions/cache@v4
  with:
    # キャッシュを無効: `cache-hit` をチェック
    save-always: false
```

## 📦 アーティファクト管理

### 保持期間

```yaml
retention-days: 30  # アーティファクト保持期間
```

- デフォルト: 30 日
- 変更例: `retention-days: 90`（90日保持）

### ダウンロード方法

**GitHub UI から:**
1. リポジトリ → Actions
2. "Build Electron VST3 Plugin" ワークフロー選択
3. 実行結果をクリック
4. 下部 "Artifacts" セクションから選択

**CLI から:**
```bash
# GitHub CLI インストール必須
gh run list --workflow build-electron-vst3.yml
gh run download <run-id> -n vst3-installer-windows
```

## 🔐 コード署名（オプション）

本番配布では、プラットフォーム固有の署名が推奨されます。

### Windows EXE 署名

Secrets に以下を追加：
```
WINDOWS_CERT_PATH
WINDOWS_CERT_PASSWORD
```

ワークフロー例：
```yaml
- name: Sign Windows executable
  run: |
    signtool sign /f ${{ secrets.WINDOWS_CERT_PATH }} ...
```

### macOS DMG 署名

Secrets に以下を追加：
```
APPLE_DEVELOPER_ID_CERT
APPLE_DEVELOPER_ID_CERT_PASSWORD
APPLE_TEAM_ID
```

### Linux AppImage（署名不要）

Linux バイナリは署名なしで配布可能。

## ⚠️ トラブルシューティング

### ビルド失敗：Node.js バージョンエラー

```
Error: The requested version of Node.js is not available
```

**解決策:**
```yaml
node-version: '20'  # 利用可能なバージョンに変更
```

### ビルド失敗：pnpm インストール失敗

```
pnpm: not found
```

**解決策:**
```yaml
- uses: pnpm/action-setup@v4
  with:
    version: 9.0.0  # pnpm バージョン確認
```

### Release が作成されない

タグをプッシュしたのに Release が作成されない場合：

1. ワークフローが `refs/tags/v*` で設定されているか確認
2. GitHub Actions permissions を確認（`contents: write` 必須）
3. ワークフロー実行ログを確認

```bash
git tag -l  # ローカルタグ確認
git ls-remote --tags origin  # リモートタグ確認
```

## 🎯 完全なリリースワークフロー

```bash
# 1. 変更をコミット
git add .
git commit -m "feat: new audio feature"
git push origin main

# 2. GitHub Actions でビルド確認
# → Actions ページで "Build Electron VST3 Plugin" が成功するまで待機

# 3. バージョンタグ作成
git tag v0.2.0

# 4. タグをプッシュ
git push origin v0.2.0

# 5. GitHub Release 自動作成確認
# → Releases ページで v0.2.0 がリリースアセット付きで作成される
```

## 📈 次のステップ

- [ ] Windows EXE コード署名の設定
- [ ] macOS DMG コード署名の設定
- [ ] リリースノートテンプレート作成
- [ ] ビルドテスト結果の自動レポート
- [ ] Slack 通知の追加

## 🔗 参考リソース

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [electron-builder Guide](https://www.electron.build/)
- [softprops/action-gh-release](https://github.com/softprops/action-gh-release)
