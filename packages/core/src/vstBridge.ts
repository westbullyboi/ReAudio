/**
 * ReAudio VST3 Bridge & Environment Detection
 * Enables Web Audio plugins to run seamlessly either in standalone browsers
 * or inside a Chromium/CEF/JUCE-based VST3 host shell (Suara style).
 */

export interface VstInfo {
  isVst: boolean;
  version?: string;
  hostName?: string;
  sampleRate?: number;
  bufferSize?: number;
}

declare global {
  interface Window {
    __REAUDIO_VST__?: {
      isVst: boolean;
      version?: string;
      hostName?: string;
      sampleRate?: number;
      bufferSize?: number;
      postMidiEvent?: (status: number, data1: number, data2: number) => void;
    };
    __SUARA_BRIDGE__?: Record<string, any>;
  }
}

export class VstEnvironment {
  /**
   * Returns true if the application is running inside a VST3 host wrapper.
   */
  static isVstEnvironment(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.__REAUDIO_VST__?.isVst || window.__SUARA_BRIDGE__);
  }

  /**
   * Get metadata about the current host environment.
   */
  static getVstInfo(): VstInfo {
    if (typeof window === 'undefined') {
      return { isVst: false };
    }
    const info = window.__REAUDIO_VST__;
    return {
      isVst: this.isVstEnvironment(),
      version: info?.version || '1.0.0',
      hostName: info?.hostName || (window.__SUARA_BRIDGE__ ? 'Suara Host' : 'Web Browser'),
      sampleRate: info?.sampleRate || 48000,
      bufferSize: info?.bufferSize || 256,
    };
  }
}

export interface AudioRingBufferHeader {
  writeIndex: number;
  readIndex: number;
  capacity: number;
  channels: number;
}

/**
 * Lock-free SharedArrayBuffer Ring Buffer for ultra-low latency PCM transport between
 * AudioWorklet and DAW Host shell.
 */
export class SharedAudioRingBuffer {
  private headerView: Int32Array;
  private channelDataViews: Float32Array[];
  private capacity: number;
  private channels: number;

  constructor(sharedBuffer: SharedArrayBuffer, channels: number = 2, capacity: number = 4096) {
    this.channels = channels;
    this.capacity = capacity;

    // Header layout: 4 * Int32 (writeIndex, readIndex, capacity, channels)
    this.headerView = new Int32Array(sharedBuffer, 0, 4);
    Atomics.store(this.headerView, 2, capacity);
    Atomics.store(this.headerView, 3, channels);

    const headerByteSize = 16;
    const channelByteSize = capacity * Float32Array.BYTES_PER_ELEMENT;

    this.channelDataViews = [];
    for (let c = 0; c < channels; ++c) {
      const offset = headerByteSize + c * channelByteSize;
      this.channelDataViews.push(new Float32Array(sharedBuffer, offset, capacity));
    }
  }

  write(inputChannels: Float32Array[]): number {
    const writeIdx = Atomics.load(this.headerView, 0);
    const readIdx = Atomics.load(this.headerView, 1);

    const available = (readIdx - writeIdx - 1 + this.capacity) % this.capacity;
    const framesToWrite = Math.min(inputChannels[0]?.length || 0, available);

    for (let i = 0; i < framesToWrite; ++i) {
      const pos = (writeIdx + i) % this.capacity;
      for (let c = 0; c < this.channels; ++c) {
        if (inputChannels[c] && this.channelDataViews[c]) {
          this.channelDataViews[c][pos] = inputChannels[c][i];
        }
      }
    }

    Atomics.store(this.headerView, 0, (writeIdx + framesToWrite) % this.capacity);
    return framesToWrite;
  }

  read(outputChannels: Float32Array[]): number {
    const writeIdx = Atomics.load(this.headerView, 0);
    const readIdx = Atomics.load(this.headerView, 1);

    const available = (writeIdx - readIdx + this.capacity) % this.capacity;
    const framesToRead = Math.min(outputChannels[0]?.length || 0, available);

    for (let i = 0; i < framesToRead; ++i) {
      const pos = (readIdx + i) % this.capacity;
      for (let c = 0; c < this.channels; ++c) {
        if (outputChannels[c] && this.channelDataViews[c]) {
          outputChannels[c][i] = this.channelDataViews[c][pos];
        }
      }
    }

    Atomics.store(this.headerView, 1, (readIdx + framesToRead) % this.capacity);
    return framesToRead;
  }
}

export class VstBridge {
  private isVstMode: boolean;
  private vstInfo: VstInfo;
  private lastLatencyUs: number = 85; // Default 85us roundtrip (Suara benchmark level)

  constructor() {
    this.isVstMode = VstEnvironment.isVstEnvironment();
    this.vstInfo = VstEnvironment.getVstInfo();
  }

  public isConnectedToVst(): boolean {
    return this.isVstMode;
  }

  public getVstInfo(): VstInfo {
    return this.vstInfo;
  }

  public getRoundTripLatencyUs(): number {
    return this.lastLatencyUs;
  }

  public sendMidiMessage(status: number, data1: number, data2: number): void {
    if (this.isVstMode && typeof window !== 'undefined' && window.__REAUDIO_VST__?.postMidiEvent) {
      window.__REAUDIO_VST__.postMidiEvent(status, data1, data2);
    } else {
      console.log(`[ReAudio VstBridge (Web Mode)] MIDI Event: 0x${status.toString(16)} ${data1} ${data2}`);
    }
  }
}
