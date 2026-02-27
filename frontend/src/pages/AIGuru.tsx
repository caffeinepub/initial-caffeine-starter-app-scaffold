import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, BookOpen, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAIChat } from '../hooks/useAIChat';
import ChatMessageComponent from '../components/ChatMessage';
import ChatTypingIndicator from '../components/ChatTypingIndicator';

const SUGGESTED_PROMPTS = [
  'भगवद गीता का सार क्या है?',
  'ध्यान कैसे करें?',
  'एकादशी व्रत का महत्व बताएं',
  'कर्म और धर्म में क्या अंतर है?',
  'राम नाम जप के फायदे क्या हैं?',
  'शिव पूजा की विधि बताएं',
  'मोक्ष क्या है?',
  'भक्ति और ज्ञान में क्या अंतर है?',
];

export default function AIGuru() {
  const { messages, isLoading, error, retryInfo, sendMessage, clearHistory } = useAIChat();
  const [inputText, setInputText] = useState('');
  const [clearConfirm, setClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (retryInfo) {
      toast.info(retryInfo, { duration: 2000 });
    }
  }, [retryInfo]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    setInputText('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (clearConfirm) {
      clearHistory();
      setClearConfirm(false);
      toast.success('Chat history cleared');
    } else {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputText(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200/30 bg-card/50 backdrop-blur-sm rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
            <img
              src="/assets/generated/ai-guru-avatar.dim_256x256.png"
              alt="Divya Guru"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-base">दिव्य गुरु</h1>
            <p className="text-xs text-muted-foreground">AI Spiritual Guide • Divya Guru</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              {messages.length} messages
            </span>
          )}
          <button
            onClick={handleClear}
            className={`p-2 rounded-full transition-colors ${
              clearConfirm
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            title={clearConfirm ? 'Tap again to confirm' : 'Clear chat'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-600/20 flex items-center justify-center mb-4 border border-amber-300/30">
              <Sparkles className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">दिव्य गुरु से पूछें</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              आध्यात्मिक प्रश्न पूछें, मंत्र जानें, और धर्म का मार्ग समझें
            </p>

            {/* Suggested prompts */}
            <div className="w-full max-w-sm space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center mb-3">
                <MessageCircle className="w-3 h-3" />
                सुझाए गए प्रश्न
              </p>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-left text-xs px-3 py-2 rounded-xl bg-amber-50/50 hover:bg-amber-100/70 border border-amber-200/40 text-amber-800 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map(message => (
          <ChatMessageComponent
            key={message.id}
            message={message}
          />
        ))}

        {isLoading && <ChatTypingIndicator />}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-sm text-center">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button
                onClick={() => sendMessage(messages[messages.length - 2]?.content || '')}
                className="text-xs text-amber-600 hover:text-amber-700 underline"
              >
                पुनः प्रयास करें
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts strip (when there are messages) */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-amber-200/20">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/40 text-amber-700 transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-amber-200/30 bg-card/50 backdrop-blur-sm rounded-b-2xl">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="अपना प्रश्न पूछें... (Enter to send)"
              rows={1}
              className="w-full resize-none rounded-2xl border border-amber-200/50 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50 max-h-32 overflow-y-auto"
              style={{ minHeight: '44px' }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Powered by Divya Guru AI
          </p>
          <p className="text-xs text-muted-foreground">Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
