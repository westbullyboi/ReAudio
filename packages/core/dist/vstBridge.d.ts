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
export declare class VstEnvironment {
    /**
     * Returns true if the application is running inside a VST3 host wrapper.
     */
    static isVstEnvironment(): boolean;
    /**
     * Get metadata about the current host environment.
     */
    static getVstInfo(): VstInfo;
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
export declare class SharedAudioRingBuffer {
    private headerView;
    private channelDataViews;
    private capacity;
    private channels;
    constructor(sharedBuffer: SharedArrayBuffer, channels?: number, capacity?: number);
    write(inputChannels: Float32Array[]): number;
    read(outputChannels: Float32Array[]): number;
}
export declare class VstBridge {
    private isVstMode;
    private vstInfo;
    private lastLatencyUs;
    constructor();
    isConnectedToVst(): boolean;
    getVstInfo(): VstInfo;
    getRoundTripLatencyUs(): number;
    sendMidiMessage(status: number, data1: number, data2: number): void;
}
//# sourceMappingURL=vstBridge.d.ts.map