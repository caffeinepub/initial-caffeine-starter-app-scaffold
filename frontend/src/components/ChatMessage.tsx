import React from 'react';
import { Play, Pause, Square, Volume2, Mic, AlertCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../hooks/useAIChat';
import { useSpeechNarration } from '../hooks/useSpeechNarration';

interface ChatMessageProps {
  message: ChatMessageType;
}

function isHindiText(text: string): boolean {
  const devanagariChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  return devanagariChars > text.length * 0.2;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const { narrationState, startNarration, pauseNarration, resumeNarration, stopNarration, error: ttsError } =
    useSpeechNarration();

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [activeMessageId, setActiveMessageId] = React.useState<string | null>(null);

  const isThisPlaying = activeMessageId === message.id && narrationState === 'playing';
  const isThisPaused = activeMessageId === message.id && narrationState === 'paused';
  const isThisActive = activeMessageId === message.id && narrationState !== 'idle' && narrationState !== 'error';
  const isThisError = activeMessageId === message.id && narrationState === 'error';

  const isHindi = isHindiText(message.content);

  const handleTTS = () => {
    if (isThisPlaying) {
      pauseNarration();
    } else if (isThisPaused) {
      resumeNarration();
    } else {
      stopNarration();
      setActiveMessageId(message.id);
      startNarration(message.content);
    }
  };

  const handleStop = () => {
    stopNarration();
    setActiveMessageId(null);
  };

  React.useEffect(() => {
    if (narrationState === 'idle' || narrationState === 'error') {
      // Only clear if this message was active
      if (activeMessageId === message.id && narrationState === 'idle') {
        setActiveMessageId(null);
      }
    }
  }, [narrationState, activeMessageId, message.id]);

  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString('hi-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold mr-2 shrink-0 mt-1 shadow-md">
          🕉️
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-tr-sm'
              : 'bg-card border border-amber-200/30 text-foreground rounded-tl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {!isUser && isSupported && (
          <div className="flex items-center gap-1 mt-1.5 ml-1 flex-wrap">
            <button
              onClick={handleTTS}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${
                isThisActive
                  ? 'bg-amber-500 text-white shadow-md'
                  : isThisError
                  ? 'bg-red-100/60 text-red-600'
                  : 'bg-amber-100/60 text-amber-700 hover:bg-amber-200/80'
              }`}
            >
              {isThisPlaying ? (
                <><Pause className="w-3 h-3" /><span>रुकें</span></>
              ) : isThisPaused ? (
                <><Play className="w-3 h-3" /><span>जारी रखें</span></>
              ) : isThisError ? (
                <><AlertCircle className="w-3 h-3" /><span>Retry</span></>
              ) : (
                <>{isHindi ? <Mic className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}<span>{isHindi ? 'हिंदी सुनें' : 'सुनें'}</span></>
              )}
            </button>

            {isThisActive && (
              <button
                onClick={handleStop}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100/60 text-red-600 hover:bg-red-200/80 transition-colors"
              >
                <Square className="w-3 h-3" />
              </button>
            )}

            {isThisError && ttsError && (
              <span className="text-xs text-red-500 ml-1 max-w-[150px] truncate" title={ttsError}>
                {ttsError}
              </span>
            )}

            <span className="text-xs text-muted-foreground ml-1">{timestamp}</span>
          </div>
        )}

        {isUser && (
          <span className="text-xs text-muted-foreground mt-1 mr-1">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold ml-2 shrink-0 mt-1 shadow-md">
          🙏
        </div>
      )}
    </div>
  );
};

export default ChatMessageComponent;
