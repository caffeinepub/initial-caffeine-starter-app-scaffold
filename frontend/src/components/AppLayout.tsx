import React, { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import BottomNav from './BottomNav';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import { useDailyNotifications } from '../hooks/useDailyNotifications';
import NotificationBanner from './NotificationBanner';
import EkadashiReminderBanner from './EkadashiReminderBanner';
import { LogIn, LogOut, Shield } from 'lucide-react';

export default function AppLayout() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentBanner, dismissBanner } = useDailyNotifications();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary shadow-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/assets/generated/om-logo.dim_128x128.png" alt="Om" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="text-primary-foreground font-bold text-base leading-tight">हिंदू धर्म</h1>
              <p className="text-primary-foreground/70 text-xs leading-tight">जय श्री राम 🙏</p>
            </div>
          </div>

          {/* Auth Button */}
          <div className="flex items-center gap-2">
            {isAuthenticated && isAdmin && (
              <div className="flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-2 py-0.5">
                <Shield size={10} className="text-yellow-300" />
                <span className="text-yellow-300 text-xs font-bold">ADMIN</span>
              </div>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground text-xs font-medium transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground text-xs font-medium transition-colors"
              >
                <LogIn size={14} />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notification Banners */}
      {currentBanner && (
        <NotificationBanner message={currentBanner} onDismiss={dismissBanner} />
      )}
      <EkadashiReminderBanner />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
