import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AudioContextValue {
  audioContext: AudioContext | null;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  resume: () => Promise<void>;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initialize = useCallback(async () => {
    if (audioContext) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);
    setIsInitialized(true);
  }, [audioContext]);

  const resume = useCallback(async () => {
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  }, [audioContext]);

  useEffect(() => {
    const handleUserInteraction = async () => {
      await initialize();
      await resume();
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [initialize, resume]);

  return (
    <AudioContext.Provider value={{ audioContext, isInitialized, initialize, resume }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}
