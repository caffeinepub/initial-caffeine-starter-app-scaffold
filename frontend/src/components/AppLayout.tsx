import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import BottomNav from './BottomNav';
import NotificationBanner from './NotificationBanner';
import { useDailyNotifications } from '../hooks/useDailyNotifications';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { currentBanner, dismissBanner } = useDailyNotifications();
  const [vratMode, setVratMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('vratMode');
    setVratMode(stored === 'true');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-saffron-700 via-saffron-600 to-gold-500 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/assets/generated/om-logo.dim_256x256.png"
              alt="Om"
              className="w-9 h-9 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-white font-bold text-lg leading-tight tracking-wide">श्री मंदिर</h1>
              <p className="text-white/80 text-xs">Hindu Devotional App</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {vratMode && (
              <Link
                to="/vrat-dashboard"
                className="bg-amber-500/20 border border-amber-400/50 text-amber-100 text-xs px-3 py-1 rounded-full font-medium"
              >
                🙏 व्रत मोड
              </Link>
            )}
            <Link
              to="/profile"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <span className="text-white text-lg">👤</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {currentBanner && (
        <NotificationBanner
          message={currentBanner}
          onDismiss={dismissBanner}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
