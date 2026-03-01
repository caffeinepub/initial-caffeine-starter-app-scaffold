import React, { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import BottomNav from './BottomNav';
import LoginButton from './LoginButton';
import ProfileSetupModal from './ProfileSetupModal';
import NotificationBanner from './NotificationBanner';
import { useDailyNotifications } from '../hooks/useDailyNotifications';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AppLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const { currentBanner, dismissBanner } = useDailyNotifications();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleDismissBanner = () => {
    dismissBanner();
    setBannerDismissed(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/om-logo.dim_256x256.png"
              alt="Om"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <h1 className="text-white font-bold text-base leading-tight">
                श्री हरि भक्ति
              </h1>
              <p className="text-amber-100 text-xs leading-tight">
                Devotional App
              </p>
            </div>
          </div>

          {/* Login/Logout Button — always visible */}
          <LoginButton />
        </div>
      </header>

      {/* Notification Banner */}
      {currentBanner && !bannerDismissed && (
        <NotificationBanner
          message={currentBanner}
          onDismiss={handleDismissBanner}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Profile Setup Modal — only shown to authenticated users without a profile */}
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
