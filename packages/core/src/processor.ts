declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

interface AudioParamDescriptor {
  name: string;
  automationRate?: 'a-rate' | 'k-rate';
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
}

export class BaseAudioWorkletProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [];
  }

  constructor() {
    super();
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
