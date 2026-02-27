import React, { useEffect, useRef, useState } from 'react';
import { Send, Trash2, ChevronDown, Sparkles, Settings, Eye, EyeOff, X, Check, ExternalLink } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import ChatMessage from '../components/ChatMessage';
import ChatTypingIndicator from '../components/ChatTypingIndicator';
import { getStoredApiKey, saveApiKey, clearApiKey } from '../lib/aiEngine';

const SUGGESTED_PROMPTS = [
  'Explain quantum physics simply',
  'Write a short poem about the ocean',
  'Generate an image of a lotus flower',
  'What is the meaning of life?',
  'Generate an image of a mountain sunset',
  'How does machine learning work?',
];

function ApiKeyPanel({ onClose }: { onClose?: () => void }) {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const currentKey = getStoredApiKey();

  const handleSave = () => {
    if (!keyInput.trim()) return;
    saveApiKey(keyInput.trim());
    setKeyInput('');
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose?.();
    }, 1200);
  };

  const handleClear = () => {
    clearApiKey();
    setKeyInput('');
    onClose?.();
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mx-4 mt-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Google Gemini API Key</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {currentKey ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
          <span className="flex-1">Gemini API key configured: <span className="font-mono">{currentKey.slice(0, 8)}••••••••</span></span>
          <button
            onClick={handleClear}
            className="text-destructive hover:text-destructive/80 font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Get a <strong>free API key</strong> from{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline inline-flex items-center gap-0.5"
          >
            Google AI Studio <ExternalLink className="w-3 h-3" />
          </a>{' '}
          — no credit card required. Image generation works without a key!
        </p>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder={currentKey ? 'Enter new Gemini API key to replace...' : 'AIza...'}
            className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!keyInput.trim() || saved}
          className="shrink-0 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : null}
          {saved ? 'Saved!' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function AIGuru() {
  const { messages, isLoading, inputValue, setInputValue, sendMessage, clearChat, messagesEndRef } =
    useAIChat();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showSettings, setShowSettings] = useState(!getStoredApiKey());

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

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const hasApiKey = !!getStoredApiKey();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
            <img
              src="/assets/generated/ai-guru-avatar.dim_256x256.png"
              alt="AI Assistant"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-foreground flex items-center gap-1">
              AI Assistant
              <Sparkles className="w-4 h-4 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Thinking...' : hasApiKey ? 'Gemini ready · Image gen always on' : 'Add Gemini API key to chat'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings((v) => !v)}
            className={`p-2 rounded-lg hover:bg-muted transition-colors ${showSettings ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            title="Gemini API Key Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Key Panel */}
      {showSettings && (
        <ApiKeyPanel onClose={() => setShowSettings(false)} />
      )}

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {/* Suggested prompts (shown when only welcome message) */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedPrompt(q)}
                  disabled={isLoading}
                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            imageUrl={msg.imageUrl}
            imagePrompt={msg.imagePrompt}
            isImage={msg.isImage}
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
            placeholder="Ask me anything or request an image..."
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
        <p className="text-center text-[10px] text-muted-foreground mt-1.5">
          Powered by Google Gemini (text) · Pollinations.ai (images) · Keys stored locally only
        </p>
      </div>
    </div>
  );
}
