import React, { useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { NotificationMessage } from '../hooks/useDailyNotifications';

interface NotificationBannerProps {
  message: NotificationMessage;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const TYPE_CONFIG = {
  namjap: {
    emoji: '🕉️',
    gradient: 'from-amber-600 to-orange-700',
    border: 'border-amber-400/60',
    label: 'नाम जप',
  },
  aarti: {
    emoji: '🪔',
    gradient: 'from-yellow-600 to-amber-700',
    border: 'border-yellow-400/60',
    label: 'आरती',
  },
  vrat: {
    emoji: '🌸',
    gradient: 'from-rose-600 to-pink-700',
    border: 'border-rose-400/60',
    label: 'व्रत',
  },
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  onDismiss,
  autoDismissMs = 10000,
}) => {
  const config = TYPE_CONFIG[message.type];

  useEffect(() => {
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [onDismiss, autoDismissMs]);

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-50 mx-3 rounded-2xl border ${config.border} shadow-2xl overflow-hidden animate-slide-down`}
      style={{
        background: `linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.45 0.16 30))`,
        boxShadow: '0 8px 32px oklch(0.35 0.14 20 / 0.6)',
      }}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${config.gradient}`} />
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-lg shrink-0 shadow-md`}
        >
          {config.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Bell className="w-3 h-3 text-amber-300" />
            <span className="text-xs text-amber-300 font-medium uppercase tracking-wide">
              {config.label} स्मरण
            </span>
          </div>
          <p className="text-sm font-semibold text-white leading-snug">{message.title}</p>
          <p className="text-xs text-white/70 mt-0.5 leading-relaxed">{message.body}</p>
        </div>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5 text-white/70" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="h-0.5 bg-white/10">
        <div
          className={`h-full bg-gradient-to-r ${config.gradient} opacity-70`}
          style={{
            animation: `shrink-width ${autoDismissMs}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
};

export default NotificationBanner;
