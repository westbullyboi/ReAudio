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

  getParameter(name: string): AudioParam {
    return this.parameters.get(name)!;
  }
}
