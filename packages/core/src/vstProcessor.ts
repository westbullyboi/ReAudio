import { BaseAudioWorkletProcessor } from './processor';

declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

export class VstAudioWorkletProcessor extends BaseAudioWorkletProcessor {
  private isVstMode: boolean = false;

  constructor() {
    super();
    this.port.onmessage = (event: MessageEvent) => {
      if (event.data?.type === 'SET_VST_MODE') {
        this.isVstMode = Boolean(event.data.isVstMode);
      }
    };
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean {
    const input = inputs[0];
    const output = outputs[0];

    if (input && output) {
      for (let channel = 0; channel < output.length; ++channel) {
        if (input[channel] && output[channel]) {
          output[channel].set(input[channel]);
        }
      }
    }

    return true;
  }
}
