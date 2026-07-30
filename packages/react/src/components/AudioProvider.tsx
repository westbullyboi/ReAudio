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

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.error('[ReAudio] Web Audio API is not supported in this browser.');
      return;
    }

    const ctx = new AudioContextClass();
    setAudioContext(ctx);
    setIsInitialized(true);

    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {
        /* Autoplay policy might block initial resume without user gesture */
      });
    }
  }, [audioContext]);

  const resume = useCallback(async () => {
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  }, [audioContext]);

  // Clean up AudioContext when Provider unmounts
  useEffect(() => {
    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
    };
  }, [audioContext]);

  // Track AudioContext state changes (e.g. suspended, running, closed)
  useEffect(() => {
    if (!audioContext) return;

    const handleStateChange = () => {
      if (audioContext.state === 'running') {
        setIsInitialized(true);
      }
    };

    audioContext.addEventListener('statechange', handleStateChange);
    return () => {
      audioContext.removeEventListener('statechange', handleStateChange);
    };
  }, [audioContext]);

  // Auto-resume on user gesture if AudioContext exists and is suspended
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!audioContext) {
        await initialize();
      } else if (audioContext.state === 'suspended') {
        await resume();
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [audioContext, initialize, resume]);

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
