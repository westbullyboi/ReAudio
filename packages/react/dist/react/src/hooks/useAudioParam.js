import { useCallback, useEffect, useState } from 'react';
export function useAudioParam(audioParam, options = {}) {
    const { minValue = 0, maxValue = 1, defaultValue = 0 } = options;
    const [value, setValue] = useState(() => audioParam ? audioParam.value : defaultValue);
    useEffect(() => {
        if (audioParam) {
            setValue(audioParam.value);
        }
    }, [audioParam]);
    const setParamValue = useCallback((newValue) => {
        const clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
        if (audioParam) {
            audioParam.value = clampedValue;
        }
        setValue(clampedValue);
    }, [audioParam, minValue, maxValue]);
    return [value, setParamValue];
}
//# sourceMappingURL=useAudioParam.js.map