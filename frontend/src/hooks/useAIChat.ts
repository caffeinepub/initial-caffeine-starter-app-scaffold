import { useState, useCallback, useRef, useEffect } from 'react';
import { getAIResponse } from '../lib/aiEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'ai',
  content:
    '🙏 Namaste! I am **AI Guru** — your all-knowing digital companion.\n\nI can answer questions on **any topic**: Hindu philosophy, scriptures, festivals, science, history, technology, health, mathematics, and much more.\n\nAsk me anything — I am here to guide you on your journey of knowledge! ✨',
  timestamp: new Date(),
};

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);
      scrollToBottom();

      try {
        const response = await getAIResponse(trimmed);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'ai',
          content: '🙏 I apologize, something went wrong. Please try asking again.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, scrollToBottom]
  );

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat, bottomRef };
}
