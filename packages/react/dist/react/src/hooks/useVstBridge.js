import { useCallback, useEffect, useState } from 'react';
import { VstBridge, VstEnvironment } from '@reaudio/core';
export function useVstBridge() {
    const [bridge] = useState(() => new VstBridge());
    const [vstInfo, setVstInfo] = useState(() => VstEnvironment.getVstInfo());
    const [isVstMode, setIsVstMode] = useState(() => bridge.isConnectedToVst());
    const [latencyUs, setLatencyUs] = useState(() => bridge.getRoundTripLatencyUs());
    useEffect(() => {
        setVstInfo(VstEnvironment.getVstInfo());
        setIsVstMode(bridge.isConnectedToVst());
        setLatencyUs(bridge.getRoundTripLatencyUs());
    }, [bridge]);
    const sendMidi = useCallback((status, data1, data2) => {
        bridge.sendMidiMessage(status, data1, data2);
    }, [bridge]);
    const toggleVstModeSimulation = useCallback(() => {
        setIsVstMode((prev) => {
            const nextMode = !prev;
            setVstInfo((current) => ({
                ...current,
                isVst: nextMode,
                hostName: nextMode ? 'Suara VST3 Host (Cubase)' : 'Web Browser',
            }));
            return nextMode;
        });
    }, []);
    return {
        isVstMode,
        vstInfo,
        latencyUs,
        sendMidi,
        toggleVstModeSimulation,
    };
}
//# sourceMappingURL=useVstBridge.js.map