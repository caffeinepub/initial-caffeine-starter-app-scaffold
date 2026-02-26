import React, { useEffect, useRef } from 'react';
import { Send, Trash2, ChevronDown, Sparkles } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import ChatMessage from '../components/ChatMessage';
import ChatTypingIndicator from '../components/ChatTypingIndicator';

const SUGGESTED_QUESTIONS = [
  'ध्यान कैसे करें?',
  'भगवद्गीता का सार क्या है?',
  'मंत्र जाप के फायदे?',
  'कर्म योग क्या है?',
  'शिव जी की पूजा कैसे करें?',
  'मोक्ष क्या है?',
];

export default function AIGuru() {
  const { messages, isLoading, inputValue, setInputValue, sendMessage, clearChat, messagesEndRef } =
    useAIChat();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = React.useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // Show scroll-to-bottom button when not at bottom
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
            <img
              src="/assets/generated/ai-guru-avatar.dim_256x256.png"
              alt="AI Guru"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-foreground flex items-center gap-1">
              AI गुरु
              <Sparkles className="w-4 h-4 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'उत्तर दे रहे हैं...' : 'ऑनलाइन'}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="चैट साफ़ करें"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {/* Suggested questions (shown when only welcome message) */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">सुझाए गए प्रश्न:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuestion(q)}
                  disabled={isLoading}
                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages — pass individual props to match ChatMessageProps interface */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Typing indicator */}
        {isLoading && <ChatTypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-10"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {/* Input area */}
      <div className="shrink-0 border-t border-border bg-background px-4 py-3">
        <div className="flex items-end gap-2 max-w-2xl mx-auto">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="अपना प्रश्न यहाँ लिखें..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-60 transition-all"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
