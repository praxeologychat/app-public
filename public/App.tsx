import React from 'react';
import { ControlBar } from './components/ControlBar';
import { Transcript } from './components/Transcript';
import { useChatAgent } from './hooks/useChatAgent';

const App: React.FC = () => {
  const { 
    agentStatus, 
    transcript, 
    sendMessage,
    isReady,
  } = useChatAgent();

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <header className="p-4 border-b border-slate-700 shadow-lg bg-slate-800/50">
        <h1 className="text-2xl font-bold text-center text-teal-300">Praxeology</h1>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="w-full max-w-2xl h-full flex flex-col bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          
          <Transcript transcript={transcript} />
          
          <ControlBar
            onSendMessage={sendMessage}
            status={agentStatus}
            disabled={!isReady}
          />
        </div>
      </main>

       <footer className="text-center p-4 text-xs text-slate-500">
        Powered by Gemini API
      </footer>
    </div>
  );
};

export default App;