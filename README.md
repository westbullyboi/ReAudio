# ReAudio

ReAudio is a Web Audio VST development framework built with TypeScript, Vite, and React. It provides a modern, type-safe approach to building audio plugins and applications using the Web Audio API.

## Features

- **Monorepo Architecture**: Organized using pnpm workspaces with separate packages for core DSP and React integration
- **TypeScript Support**: Strict mode enabled for maximum type safety
- **AudioWorklet Support**: Built-in support for low-latency audio processing
- **React Integration**: Custom hooks and providers for seamless React component integration
- **Vite-based**: Fast development experience with Vite bundling

## Directory Structure

```
/
├── packages/
│   ├── core/          # DSP/AudioWorklet processing package
│   └── react/         # React components and hooks package
├── examples/
│   └── demo-plugin/   # Sample application
└── Configuration files
```

## Packages

### @reaudio/core
Core DSP and AudioWorklet processing for the ReAudio framework.

### @reaudio/react
React components and hooks for integrating ReAudio into React applications.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 9.0.0+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Building

```bash
pnpm build
```

## License

MIT