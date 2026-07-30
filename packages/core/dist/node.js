export class AudioWorkletNodeWrapper extends AudioWorkletNode {
    constructor(context, name, options) {
        super(context, name, options);
    }
    getParameter(name) {
        const param = this.parameters.get(name);
        if (!param) {
            console.warn(`[ReAudio] AudioParam '${name}' not found on AudioWorkletNode.`);
        }
        return param;
    }
}
//# sourceMappingURL=node.js.map