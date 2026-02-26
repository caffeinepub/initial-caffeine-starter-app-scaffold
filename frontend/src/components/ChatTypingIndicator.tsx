import React from 'react';

export default function ChatTypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      {/* AI Avatar */}
      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold to-saffron overflow-hidden shadow-md">
        <img
          src="/assets/generated/ai-guru-avatar.dim_256x256.png"
          alt="AI Guru"
          className="w-full h-full object-cover"
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement!.textContent = '🕉️';
          }}
        />
      </div>

      {/* Typing bubble */}
      <div className="bg-white border border-gold/30 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-saffron animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-saffron animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-saffron animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
