declare class AudioWorkletProcessor {
    readonly port: MessagePort;
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
interface AudioParamDescriptor {
    name: string;
    automationRate?: 'a-rate' | 'k-rate';
    defaultValue?: number;
    minValue?: number;
    maxValue?: number;
}
export declare class BaseAudioWorkletProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors(): AudioParamDescriptor[];
    constructor();
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
export {};
//# sourceMappingURL=processor.d.ts.map