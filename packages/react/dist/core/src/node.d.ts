export interface AudioWorkletNodeWrapperOptions extends AudioWorkletNodeOptions {
    numberOfInputs?: number;
    numberOfOutputs?: number;
    outputChannelCount?: number[];
}
export declare class AudioWorkletNodeWrapper extends AudioWorkletNode {
    constructor(context: BaseAudioContext, name: string, options?: AudioWorkletNodeWrapperOptions);
    getParameter(name: string): AudioParam | undefined;
}
//# sourceMappingURL=node.d.ts.map