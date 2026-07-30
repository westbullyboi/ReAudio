import { BaseAudioWorkletProcessor } from './processor';
export declare class VstAudioWorkletProcessor extends BaseAudioWorkletProcessor {
    private isVstMode;
    constructor();
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
//# sourceMappingURL=vstProcessor.d.ts.map