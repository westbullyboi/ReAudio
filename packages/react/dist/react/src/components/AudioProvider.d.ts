import React from 'react';
interface AudioContextValue {
    audioContext: AudioContext | null;
    isInitialized: boolean;
    initialize: () => Promise<void>;
    resume: () => Promise<void>;
}
export interface AudioProviderProps {
    children: React.ReactNode;
}
export declare function AudioProvider({ children }: AudioProviderProps): React.JSX.Element;
export declare function useAudioContext(): AudioContextValue;
export {};
//# sourceMappingURL=AudioProvider.d.ts.map