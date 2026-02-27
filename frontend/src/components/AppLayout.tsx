import React from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ProfileSetupModal from './ProfileSetupModal';
import BottomNav from './BottomNav';
import LoginButton from './LoginButton';
import NotificationBanner from './NotificationBanner';
import { useDailyNotifications } from '../hooks/useDailyNotifications';

export default function AppLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const navigate = useNavigate();

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Initialize daily notification system
  const { currentBanner, dismissBanner } = useDailyNotifications();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.45 0.16 30))',
          borderBottom: '1px solid oklch(0.82 0.18 80 / 0.3)',
          boxShadow: '0 2px 20px oklch(0.35 0.14 20 / 0.5)',
        }}
      >
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2"
        >
          <img
            src="/assets/generated/om-logo.dim_256x256.png"
            alt="Om"
            className="w-8 h-8 object-contain animate-mandala-spin"
            style={{ filter: 'sepia(1) saturate(3) hue-rotate(10deg)' }}
          />
          <span
            className="font-heading text-xl"
            style={{ color: '#FFD700', textShadow: '0 0 10px oklch(0.82 0.18 80 / 0.4)' }}
          >
            श्री हरि ॐ
          </span>
        </button>

        <LoginButton />
      </header>

      {/* In-app notification banner (fallback when browser notifications are denied/unsupported) */}
      {currentBanner && (
        <NotificationBanner message={currentBanner} onDismiss={dismissBanner} />
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal open={showProfileSetup} />}

      {/* Footer */}
      <footer
        className="py-4 text-center text-xs pb-20"
        style={{
          background: 'linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.45 0.16 30))',
          color: 'oklch(0.82 0.18 80 / 0.6)',
          borderTop: '1px solid oklch(0.82 0.18 80 / 0.2)',
        }}
      >
        <p>
          © {new Date().getFullYear()} श्री हरि ॐ — Built with{' '}
          <span style={{ color: '#FFD700' }}>🙏</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'oklch(0.82 0.18 80)', textDecoration: 'underline' }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
