import { useState, useRef, useCallback } from 'react';
import { getAIResponse, type ChatMessage } from '../lib/aiEngine';

export interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  imagePrompt?: string;
  isImage?: boolean;
}

const WELCOME_MESSAGE: ChatEntry = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! 👋 I'm your AI Assistant. I can answer questions on **any topic** — science, history, coding, philosophy, and more.\n\nI can also **generate images** for you! Just say something like:\n• *\"Generate an image of a sunset over mountains\"*\n• *\"Draw a lotus flower\"*\n\nConfigure your API key in settings above to unlock full chat capabilities.",
  timestamp: new Date(),
};

export function useAIChat() {
  const [messages, setMessages] = useState<ChatEntry[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = (text ?? inputValue).trim();
      if (!messageText || isLoading) return;

      setInputValue('');

      const userEntry: ChatEntry = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userEntry]);
      setIsLoading(true);
      scrollToBottom();

      // Build conversation history for context (last 8 messages, text only)
      const historyForAPI: ChatMessage[] = messages
        .filter((m) => !m.isImage)
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const response = await getAIResponse(messageText, historyForAPI);

        const assistantEntry: ChatEntry = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.text || (response.isImage ? `Here's your generated image of: **${response.imagePrompt}**` : ''),
          timestamp: new Date(),
          imageUrl: response.imageUrl,
          imagePrompt: response.imagePrompt,
          isImage: response.isImage,
        };

        setMessages((prev) => [...prev, assistantEntry]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        const errorEntry: ChatEntry = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `❌ ${errorMessage}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorEntry]);
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    },
    [inputValue, isLoading, messages, scrollToBottom]
  );

  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, id: `welcome-${Date.now()}`, timestamp: new Date() }]);
    setInputValue('');
  }, []);

  return {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
}
