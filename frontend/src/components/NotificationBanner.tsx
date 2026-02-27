import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { NotificationMessage } from '../hooks/useDailyNotifications';

interface NotificationBannerProps {
  message: NotificationMessage;
  onDismiss: () => void;
}

const typeConfig = {
  namjap: {
    emoji: '📿',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(245,158,11,0.1))',
    border: 'rgba(249,115,22,0.4)',
    glow: 'rgba(249,115,22,0.2)',
    bar: '#f97316',
  },
  aarti: {
    emoji: '🪔',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.1))',
    border: 'rgba(245,158,11,0.4)',
    glow: 'rgba(245,158,11,0.2)',
    bar: '#f59e0b',
  },
  vrat: {
    emoji: '🙏',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(167,139,250,0.1))',
    border: 'rgba(139,92,246,0.4)',
    glow: 'rgba(139,92,246,0.2)',
    bar: '#8b5cf6',
  },
};

export default function NotificationBanner({ message, onDismiss }: NotificationBannerProps) {
  const [progress, setProgress] = useState(100);
  const config = typeConfig[message.type] || typeConfig.namjap;

  useEffect(() => {
    const duration = 10000;
    const interval = 100;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [message.title, onDismiss]);

  return (
    <div
      className="mx-4 mt-2 mb-1 rounded-xl border overflow-hidden"
      style={{
        background: config.gradient,
        borderColor: config.border,
        boxShadow: `0 4px 20px ${config.glow}`,
      }}
    >
      <div className="flex items-start gap-3 p-3">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg"
          style={{
            background: 'rgba(0,0,0,0.2)',
            border: `1px solid ${config.border}`,
          }}
        >
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{message.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{message.body}</p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <X size={14} />
        </button>
      </div>
      <div className="h-0.5 bg-black/20">
        <div
          className="h-full transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${progress}%`, background: config.bar }}
        />
      </div>
    </div>
  );
}
