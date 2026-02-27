import React from 'react';
import { Play, Pause, Square, Volume2, Mic } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../hooks/useAIChat';
import { useSpeechNarration } from '../hooks/useSpeechNarration';

interface ChatMessageProps {
  message: ChatMessageType;
}

// Detect if text is primarily Hindi/Devanagari
function isHindiText(text: string): boolean {
  const devanagariChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  return devanagariChars > text.length * 0.2;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const { narrationState, currentMessageId, speak, pause, resume, stop, isSupported } =
    useSpeechNarration();

  const isThisPlaying =
    currentMessageId === message.id && narrationState === 'playing';
  const isThisPaused =
    currentMessageId === message.id && narrationState === 'paused';
  const isThisActive = currentMessageId === message.id;

  const isHindi = isHindiText(message.content);

  const handleTTS = () => {
    if (isThisPlaying) {
      pause();
    } else if (isThisPaused) {
      resume();
    } else {
      speak(message.content, message.id);
    }
  };

  const handleStop = () => {
    stop();
  };

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
          {/* Message text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* TTS controls for assistant messages */}
        {!isUser && isSupported && (
          <div className="flex items-center gap-1 mt-1.5 ml-1">
            <button
              onClick={handleTTS}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${
                isThisActive
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-amber-100/60 text-amber-700 hover:bg-amber-200/80'
              }`}
              title={
                isThisPlaying
                  ? 'Pause narration'
                  : isThisPaused
                  ? 'Resume narration'
                  : isHindi
                  ? 'हिंदी में सुनें'
                  : 'Listen'
              }
            >
              {isThisPlaying ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>रुकें</span>
                </>
              ) : isThisPaused ? (
                <>
                  <Play className="w-3 h-3" />
                  <span>जारी रखें</span>
                </>
              ) : (
                <>
                  {isHindi ? (
                    <Mic className="w-3 h-3" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                  <span>{isHindi ? 'हिंदी सुनें' : 'सुनें'}</span>
                </>
              )}
            </button>

            {isThisActive && (
              <button
                onClick={handleStop}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100/60 text-red-600 hover:bg-red-200/80 transition-colors"
                title="Stop narration"
              >
                <Square className="w-3 h-3" />
              </button>
            )}

            <span className="text-xs text-muted-foreground ml-1">{timestamp}</span>
          </div>
        )}

        {/* Timestamp for user messages */}
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
