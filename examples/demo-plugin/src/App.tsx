import { AudioProvider, useAudioContext } from '@reaudio/react';

function DemoContent() {
  const { audioContext, isInitialized, initialize, resume } = useAudioContext();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>ReAudio Demo Plugin</h1>
      <p>Web Audio VST 開発フレームワーク ReAudio のデモアプリケーションです。</p>
      
      <div style={{ marginTop: '20px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>AudioContext ステータス</h2>
        <p>
          初期化状態: <strong>{isInitialized ? '初期化済み (Yes)' : '未初期化 (No)'}</strong>
        </p>
        {audioContext && (
          <>
            <p>
              コンテキスト状態: <strong>{audioContext.state}</strong>
            </p>
            <p>
              サンプルレート: <strong>{audioContext.sampleRate} Hz</strong>
            </p>
          </>
        )}
        
        <div style={{ marginTop: '12px' }}>
          {!audioContext ? (
            <button
              onClick={() => initialize()}
              style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
            >
              AudioContext を初期化
            </button>
          ) : audioContext.state === 'suspended' ? (
            <button
              onClick={() => resume()}
              style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
            >
              AudioContext を再開 (Resume)
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p>
          💡 画面上をクリックするかキーを押すことで、ブラウザの Autoplay ポリシーを満たして AudioContext を起動できます。
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
