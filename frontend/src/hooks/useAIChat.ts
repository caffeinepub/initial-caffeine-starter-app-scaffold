import { useState, useRef, useCallback } from 'react';
import { getAIResponse, type ChatMessage } from '../lib/aiEngine';

export interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'नमस्ते! 🙏 मैं आपका AI गुरु हूँ। मैं आपको हिंदू दर्शन, ध्यान, मंत्र, योग और आध्यात्मिक मार्गदर्शन में सहायता कर सकता हूँ। आप मुझसे कोई भी प्रश्न पूछ सकते हैं।',
      timestamp: new Date(),
    },
  ]);
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

      // Clear input immediately
      setInputValue('');

      // Add user message optimistically
      const userEntry: ChatEntry = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userEntry]);
      setIsLoading(true);
      scrollToBottom();

      // Build conversation history for context (last 6 messages)
      const historyForAPI: ChatMessage[] = messages
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const response = await getAIResponse(messageText, historyForAPI);

        const assistantEntry: ChatEntry = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantEntry]);
      } catch (_err) {
        const errorEntry: ChatEntry = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            'क्षमा करें, AI गुरु से संपर्क नहीं हो पा रहा। कृपया पुनः प्रयास करें। 🙏',
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
    setMessages([
      {
        id: 'welcome-new',
        role: 'assistant',
        content:
          'नमस्ते! 🙏 मैं आपका AI गुरु हूँ। मैं आपको हिंदू दर्शन, ध्यान, मंत्र, योग और आध्यात्मिक मार्गदर्शन में सहायता कर सकता हूँ। आप मुझसे कोई भी प्रश्न पूछ सकते हैं।',
        timestamp: new Date(),
      },
    ]);
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
