export class BaseAudioWorkletProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [];
    }
    constructor() {
        super();
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
//# sourceMappingURL=processor.js.map