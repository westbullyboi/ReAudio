import { BaseAudioWorkletProcessor } from './processor';
export class VstAudioWorkletProcessor extends BaseAudioWorkletProcessor {
    constructor() {
        super();
        Object.defineProperty(this, "isVstMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.port.onmessage = (event) => {
            if (event.data?.type === 'SET_VST_MODE') {
                this.isVstMode = Boolean(event.data.isVstMode);
            }
        };
    }
    process(inputs, outputs, parameters) {
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
//# sourceMappingURL=vstProcessor.js.map