import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, MessageCircle } from 'lucide-react';
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
  const { messages, isLoading, error, sendMessage, clearHistory } = useAIChat();
  const [inputText, setInputText] = useState('');
  const [clearConfirm, setClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200/30 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
            <img
              src="/assets/generated/ai-guru-avatar.dim_256x256.png"
              alt="Divya Guru"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-base">दिव्य गुरु</h1>
            <p className="text-xs text-muted-foreground">AI Spiritual Guide</p>
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
                    className="text-left text-xs px-3 py-2 rounded-xl bg-amber-50/50 hover:bg-amber-100/70 border border-amber-200/40 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-700/40 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map(message => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}

        {isLoading && <ChatTypingIndicator />}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 max-w-sm text-center">
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>
              <button
                onClick={() => {
                  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                  if (lastUserMsg) sendMessage(lastUserMsg.content);
                }}
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
                className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/40 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/40 transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="अपना प्रश्न यहाँ लिखें..."
            rows={1}
            className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 max-h-32"
            style={{ minHeight: '42px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
