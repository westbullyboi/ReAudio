import { VstInfo } from '@reaudio/core';
export interface UseVstBridgeResult {
    isVstMode: boolean;
    vstInfo: VstInfo;
    latencyUs: number;
    sendMidi: (status: number, data1: number, data2: number) => void;
    toggleVstModeSimulation: () => void;
}
export declare function useVstBridge(): UseVstBridgeResult;
//# sourceMappingURL=useVstBridge.d.ts.map