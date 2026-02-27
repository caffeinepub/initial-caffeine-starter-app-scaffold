import React from 'react';
import { Outlet } from '@tanstack/react-router';
import BottomNav from './BottomNav';
import ProfileSetupModal from './ProfileSetupModal';
import NotificationBanner from './NotificationBanner';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useDailyNotifications } from '../hooks/useDailyNotifications';
import LoginButton from './LoginButton';

export default function AppLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const { currentBanner, dismissBanner } = useDailyNotifications();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #FFF8E7 0%, #FFF3D4 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-saffron" style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 40%, #FFD700 100%)' }}>
        {/* Decorative top border */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #C0392B, #FFD700, #FF6B00, #FFD700, #C0392B)' }} />

        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center animate-divine-pulse"
                style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.6)' }}
              >
                <img
                  src="/assets/generated/om-logo.dim_256x256.png"
                  alt="OM"
                  className="w-7 h-7 object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span style="color:white;font-size:20px;font-family:serif">ॐ</span>';
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <h1
                className="font-devanagari text-white font-bold text-lg leading-tight"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
              >
                श्री भक्ति मंदिर
              </h1>
              <p className="text-xs text-white/80">Devotional App</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xl hidden sm:block">🕉️</span>
            <LoginButton />
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="h-0.5" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
      </header>

      {/* Notification Banner */}
      {currentBanner && (
        <NotificationBanner message={currentBanner} onDismiss={dismissBanner} />
      )}

      {/* Main Content */}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
