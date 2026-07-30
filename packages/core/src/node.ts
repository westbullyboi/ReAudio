export interface AudioWorkletNodeWrapperOptions extends AudioWorkletNodeOptions {
  numberOfInputs?: number;
  numberOfOutputs?: number;
  outputChannelCount?: number[];
}

export class AudioWorkletNodeWrapper extends AudioWorkletNode {
  constructor(
    context: BaseAudioContext,
    name: string,
    options?: AudioWorkletNodeWrapperOptions
  ) {
    super(context, name, options);
  }

  getParameter(name: string): AudioParam | undefined {
    const param = this.parameters.get(name);
    if (!param) {
      console.warn(`[ReAudio] AudioParam '${name}' not found on AudioWorkletNode.`);
    }
    return param;
  }
}
