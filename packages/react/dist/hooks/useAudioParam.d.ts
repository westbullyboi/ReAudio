export interface UseAudioParamOptions {
    minValue?: number;
    maxValue?: number;
    defaultValue?: number;
}
export declare function useAudioParam(audioParam: AudioParam | null, options?: UseAudioParamOptions): [number, (value: number) => void];
//# sourceMappingURL=useAudioParam.d.ts.map