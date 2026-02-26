import React from 'react';

interface ChatMessageProps {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simple markdown-like renderer: bold (**text**), newlines
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part === '\n') {
      return <br key={i} />;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md ${
          isUser
            ? 'bg-saffron text-white'
            : 'bg-gradient-to-br from-gold to-saffron text-white overflow-hidden'
        }`}
      >
        {isUser ? (
          <span>👤</span>
        ) : (
          <img
            src="/assets/generated/ai-guru-avatar.dim_256x256.png"
            alt="AI Guru"
            className="w-full h-full object-cover"
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.textContent = '🕉️';
            }}
          />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-saffron text-white rounded-br-sm'
              : 'bg-white border border-gold/30 text-foreground rounded-bl-sm'
          }`}
        >
          {renderContent(content)}
        </div>
        <span className="text-[10px] text-muted-foreground px-1">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
}
