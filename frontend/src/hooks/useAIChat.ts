import { useState, useCallback, useEffect } from 'react';
import {
  generateAIResponse,
  ConversationMessage
} from '../lib/aiEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const STORAGE_KEY = 'aiGuru_chatHistory';
const MAX_HISTORY = 50;

function loadHistory(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.slice(-MAX_HISTORY);
    }
  } catch {
    // ignore
  }
  return [];
}

function saveHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
  } catch {
    // ignore
  }
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryInfo, setRetryInfo] = useState<string | null>(null);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const buildConversationHistory = useCallback(
    (msgs: ChatMessage[]): ConversationMessage[] => {
      return msgs
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));
    },
    []
  );

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isLoading) return;

      setError(null);
      setRetryInfo(null);

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: userText.trim(),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const history = buildConversationHistory([...messages, userMsg]);

        const response = await generateAIResponse(
          userText,
          history,
          (attempt) => {
            setRetryInfo(`पुनः प्रयास ${attempt}...`);
          }
        );

        setRetryInfo(null);

        const assistantMsg: ChatMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, assistantMsg]);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(`उत्तर प्राप्त करने में समस्या हुई: ${errorMsg}`);
      } finally {
        setIsLoading(false);
        setRetryInfo(null);
      }
    },
    [isLoading, messages, buildConversationHistory]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
    setRetryInfo(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    error,
    retryInfo,
    sendMessage,
    clearHistory
  };
}
