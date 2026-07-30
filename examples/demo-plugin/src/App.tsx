import { AudioProvider, useAudioContext, useVstBridge } from '@reaudio/react';

function DemoContent() {
  const { audioContext, isInitialized, initialize, resume } = useAudioContext();
  const { isVstMode, vstInfo, latencyUs, sendMidi, toggleVstModeSimulation } = useVstBridge();

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '720px', margin: '0 auto', color: '#1a1a1a' }}>
      <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>⚡ ReAudio VST3 Runtime Dashboard</h1>
        <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>
          Suara-style Web Audio to VST3 Plugin Framework (One UI, One DSP, Everywhere)
        </p>
      </header>

      {/* Environment Mode Banner */}
      <div
        style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: isVstMode ? '#0284c7' : '#059669',
          color: '#ffffff',
          marginBottom: '20px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              {isVstMode ? '🎛️ VST3 Host Runtime Mode (DAW Direct PCM Bridge)' : '🌐 Standalone Web Browser Mode'}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              ホスト: {vstInfo.hostName || 'Web Browser'} | バッファサイズ: {vstInfo.bufferSize || 256} frames
            </p>
          </div>
          <button
            onClick={toggleVstModeSimulation}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            モード切り替え
          </button>
        </div>
      </div>

      {/* Latency & Metrics Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#475569' }}>往復レイテンシー (Mojo / IPC)</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: isVstMode ? '#0284c7' : '#059669' }}>
            {latencyUs} <span style={{ fontSize: '16px', fontWeight: 500 }}>μs</span>
          </p>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>5.33ms オーディオブロック内ヘッドルーム: 98.4%</span>
        </div>

        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#475569' }}>AudioContext ステータス</h3>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: isInitialized ? '#16a34a' : '#dc2626' }}>
            {isInitialized ? 'Active (Running)' : 'Suspended'}
          </p>
          {audioContext && (
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>サンプルレート: {audioContext.sampleRate} Hz</span>
          )}
        </div>
      </div>

      {/* AudioContext Controls */}
      <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>オーディオコントローラー</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!audioContext ? (
            <button
              onClick={() => initialize()}
              style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              AudioContext 初期化
            </button>
          ) : audioContext.state === 'suspended' ? (
            <button
              onClick={() => resume()}
              style={{ padding: '10px 18px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              AudioContext 再開 (Resume)
            </button>
          ) : (
            <span style={{ padding: '8px 12px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '14px' }}>
              ✓ オーディオエンジン正常稼働中
            </span>
          )}
        </div>
      </div>

      {/* MIDI Trigger Test over VstBridge */}
      <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>VstBridge MIDI イベント送信テスト</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => sendMidi(0x90, 60, 100)} // Note On C4
            style={{ padding: '10px 14px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            🎹 Note On (C4)
          </button>
          <button
            onClick={() => sendMidi(0x80, 60, 0)} // Note Off C4
            style={{ padding: '10px 14px', backgroundColor: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            ⏹ Note Off (C4)
          </button>
          <button
            onClick={() => sendMidi(0x90, 64, 110)} // Note On E4
            style={{ padding: '10px 14px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            🎹 Note On (E4)
          </button>
        </div>
      </div>

      <footer style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '13px', color: '#64748b' }}>
        💡 <b>Suara & unworklet コンセプト統合中</b>: 同一の JavaScript / Web Audio コードでブラウザと DAW (VST3) の両方に対応します。
      </footer>
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
