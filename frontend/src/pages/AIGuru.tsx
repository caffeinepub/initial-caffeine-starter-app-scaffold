import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Sparkles, Send, Trash2, ChevronDown } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import ChatMessage from '../components/ChatMessage';
import ChatTypingIndicator from '../components/ChatTypingIndicator';

const SUGGESTED_QUESTIONS = [
  'What is the meaning of Om?',
  'Tell me about Lord Krishna',
  'What is karma?',
  'Explain quantum physics',
  'What is AI?',
  'Tell me about Diwali',
  'What is yoga?',
  'History of India',
];

export default function AIGuru() {
  const { messages, isLoading, sendMessage, clearChat, bottomRef } = useAIChat();
  const [input, setInput] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Track scroll position to show/hide scroll-to-bottom button
  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 120);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (q: string) => {
    sendMessage(q);
    inputRef.current?.focus();
  };

  // Auto-resize textarea
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto relative">
      {/* ── Header ── */}
      <div className="shrink-0 bg-gradient-to-r from-saffron to-gold px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
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
          <div>
            <h1 className="text-white font-bold text-base leading-tight flex items-center gap-1.5">
              AI Guru
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
            </h1>
            <p className="text-white/80 text-xs">
              {isLoading ? (
                <span className="animate-pulse">Thinking…</span>
              ) : (
                'Ask me anything ✨'
              )}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Clear chat"
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2 bg-cream/60"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Suggested questions — only show when only welcome message exists */}
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground text-center mb-3 font-medium uppercase tracking-wide">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => handleSuggestion(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-saffron/30 text-saffron hover:bg-saffron hover:text-white transition-all duration-200 shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {isLoading && <ChatTypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-4 z-10 w-9 h-9 rounded-full bg-saffron text-white shadow-saffron flex items-center justify-center hover:bg-saffron-dark transition-colors animate-bounce"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {/* ── Input area ── */}
      <div className="shrink-0 bg-white border-t border-gold/20 px-3 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-end gap-2 bg-cream rounded-2xl border border-gold/30 px-3 py-2 focus-within:border-saffron/60 focus-within:shadow-saffron transition-all duration-200">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything… (Press Enter to send)"
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground leading-relaxed max-h-[120px] disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-9 h-9 rounded-xl bg-saffron text-white flex items-center justify-center hover:bg-saffron-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-saffron"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
          Shift+Enter for new line • Enter to send
        </p>
      </div>
    </div>
  );
}
