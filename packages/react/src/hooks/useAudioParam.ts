import { useEffect, useRef, useState } from 'react';

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
  const [value, setValue] = useState(defaultValue);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!audioParam) return;

    const updateValue = () => {
      setValue(audioParam.value);
      rafRef.current = requestAnimationFrame(updateValue);
    };

    rafRef.current = requestAnimationFrame(updateValue);

    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [audioParam]);

  const setParamValue = (newValue: number) => {
    const clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
    if (audioParam) {
      audioParam.value = clampedValue;
    }
    setValue(clampedValue);
  };

  return [value, setParamValue];
}
