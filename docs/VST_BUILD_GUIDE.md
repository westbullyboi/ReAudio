# ReAudio VST Build Guide

This guide explains how to build and package the ReAudio VST plugin.

## Local Build

### Prerequisites
- Node.js 18+
- pnpm 9.0.0+

### Build Steps

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Build all packages**
   ```bash
   pnpm build
   ```

3. **Build and package VST plugin**
   ```bash
   pnpm build:vst
   ```

The packaged VST plugin will be created in `dist/ReAudio-0.1.0.zip`.

### Output Structure

After building, the VST output will be located in `dist/vst/`:

```
dist/vst/
├── plugin.json          # Plugin metadata
├── index.html           # Main plugin HTML
├── assets/              # Built JavaScript and styles
└── ...                  # Other plugin assets
```

## Automated Build (GitHub Actions)

The VST plugin is automatically built and packaged via GitHub Actions workflow on:

- **Push to main branch** (with relevant file changes)
- **Pull requests** to main branch
- **Manual trigger** (via workflow_dispatch)

### Workflow File

Location: `.github/workflows/build-vst.yml`

The workflow performs the following steps:

1. Setup Node.js and pnpm
2. Install dependencies
3. Build all packages
4. Build demo-plugin (VST)
5. Package VST plugin
6. Upload artifacts

### Accessing Build Artifacts

After a workflow run completes:

1. Go to the GitHub Actions page
2. Select the "Build VST Plugin" workflow
3. Download artifacts:
   - `vst-plugin` - VST directory structure
   - `vst-package` - Zipped VST plugin

### Release Builds

For tagged releases (e.g., `v0.2.0`), the workflow automatically:

1. Creates a GitHub Release
2. Uploads the VST package as a release asset

## VST Plugin Details

- **Type**: Web Audio API based VST
- **Format**: Vite-bundled web application
- **Platform Support**: Cross-platform (via browser)
- **Configuration**: See `examples/demo-plugin/vite.config.ts`

## Troubleshooting

### Build fails with "pnpm not found"

Ensure pnpm is installed and in your PATH:
```bash
npm install -g pnpm@9.0.0
```

### Missing dependencies

Clear cache and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Zip package not created

Ensure `zip` utility is installed (usually pre-installed on Unix-like systems).

For Windows, install Git Bash or use native zip tools.

## Environment Variables

### Local Build

```bash
VERSION=0.2.0 pnpm build:vst
```

Defaults to version from `package.json` if not specified.

## Next Steps

- Integrate with audio DAWs using VST Host
- Customize plugin UI in `examples/demo-plugin/src/App.tsx`
- Add more audio processors in `packages/core/src/`
