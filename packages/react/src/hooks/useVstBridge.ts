import { useCallback, useEffect, useState } from 'react';
import { VstBridge, VstEnvironment, VstInfo } from '@reaudio/core';

export interface UseVstBridgeResult {
  isVstMode: boolean;
  vstInfo: VstInfo;
  latencyUs: number;
  sendMidi: (status: number, data1: number, data2: number) => void;
  toggleVstModeSimulation: () => void;
}

export function useVstBridge(): UseVstBridgeResult {
  const [bridge] = useState(() => new VstBridge());
  const [vstInfo, setVstInfo] = useState<VstInfo>(() => VstEnvironment.getVstInfo());
  const [isVstMode, setIsVstMode] = useState<boolean>(() => bridge.isConnectedToVst());
  const [latencyUs, setLatencyUs] = useState<number>(() => bridge.getRoundTripLatencyUs());

  useEffect(() => {
    setVstInfo(VstEnvironment.getVstInfo());
    setIsVstMode(bridge.isConnectedToVst());
    setLatencyUs(bridge.getRoundTripLatencyUs());
  }, [bridge]);

  const sendMidi = useCallback(
    (status: number, data1: number, data2: number) => {
      bridge.sendMidiMessage(status, data1, data2);
    },
    [bridge]
  );

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
