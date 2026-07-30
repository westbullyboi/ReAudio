import { AudioProvider, useAudioContext } from '@reaudio/react';

function DemoContent() {
  const { audioContext, isInitialized } = useAudioContext();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ReAudio Demo Plugin</h1>
      <p>Welcome to the ReAudio Web Audio framework demo.</p>
      <div style={{ marginTop: '20px' }}>
        <h2>Status</h2>
        <p>
          AudioContext Initialized: <strong>{isInitialized ? 'Yes' : 'No'}</strong>
        </p>
        {audioContext && (
          <p>
            Sample Rate: <strong>{audioContext.sampleRate} Hz</strong>
          </p>
        )}
      </div>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p>
          Click anywhere or press a key to initialize the AudioContext and start using the framework.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <DemoContent />
    </AudioProvider>
  );
}
