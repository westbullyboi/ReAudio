import { useCallback, useEffect, useState } from 'react';

export interface UseAudioParamOptions {
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
}

export function useAudioParam(
  audioParam: AudioParam | null,
  options: UseAudioParamOptions = {}
): [number, (value: number) => void] {
  const { minValue = 0, maxValue = 1, defaultValue = 0 } = options;
  const [value, setValue] = useState<number>(() => audioParam ? audioParam.value : defaultValue);

  useEffect(() => {
    if (audioParam) {
      setValue(audioParam.value);
    }
  }, [audioParam]);

  const setParamValue = useCallback(
    (newValue: number) => {
      const clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
      if (audioParam) {
        audioParam.value = clampedValue;
      }
      setValue(clampedValue);
    },
    [audioParam, minValue, maxValue]
  );

  return [value, setParamValue];
}
