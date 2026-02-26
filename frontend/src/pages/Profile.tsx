import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetJapStats } from '../hooks/useQueries';
import LoginButton from '../components/LoginButton';
import VratModeToggle from '../components/VratModeToggle';
import PremiumBanner from '../components/PremiumBanner';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import { Settings, Shield } from 'lucide-react';

export default function Profile() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: japStats, isLoading: statsLoading } = useGetJapStats();

  const [vratMode, setVratMode] = useState(() => {
    return localStorage.getItem('vratMode') === 'true';
  });

  const handleVratToggle = (val: boolean) => {
    setVratMode(val);
    localStorage.setItem('vratMode', val.toString());
  };

  const displayName = userProfile?.name || (isAuthenticated ? 'Bhakt' : 'Guest');
  const initials = displayName.slice(0, 2).toUpperCase();
  const principalShort = identity
    ? identity.getPrincipal().toString().slice(0, 8) + '...'
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-saffron to-saffron/80 px-4 pt-6 pb-12 text-white text-center relative overflow-hidden">
        <img
          src="/assets/generated/om-logo.dim_256x256.png"
          alt="Om"
          className="absolute right-4 top-4 w-16 h-16 opacity-20"
        />
        <h1 className="font-devanagari text-xl font-bold relative z-10">👤 प्रोफाइल</h1>
        <p className="text-sm font-body opacity-90 mt-1 relative z-10">Profile</p>
      </div>

      <div className="px-4 -mt-8 space-y-4 pb-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border-2 border-gold/20 p-5 shadow-gold text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-white text-2xl font-bold font-devanagari mx-auto mb-3 shadow-saffron">
            {initials}
          </div>

          {profileLoading ? (
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
          ) : (
            <h2 className="font-devanagari text-xl font-bold text-foreground mb-1">
              {displayName}
            </h2>
          )}

          {isAuthenticated ? (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-body">
                🔐 Internet Identity
              </p>
              {principalShort && (
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {principalShort}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-body">
              👤 Guest Mode — Login to save progress
            </p>
          )}

          <div className="mt-4">
            <LoginButton />
          </div>
        </div>

        {/* Stats */}
        {isAuthenticated && (
          <div className="bg-white rounded-2xl border-2 border-gold/20 p-4">
            <h3 className="font-devanagari text-sm font-bold text-saffron mb-3">📊 आपके आँकड़े</h3>
            {statsLoading ? (
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center bg-saffron/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-saffron font-body">
                    {japStats ? Number(japStats.lifetime).toLocaleString() : 0}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">Total Jap</p>
                </div>
                <div className="text-center bg-saffron/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-saffron font-body">
                    {japStats ? Number(japStats.daily) : 0}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">Today's Jap</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Premium Banner */}
        <PremiumBanner />

        {/* Vrat Mode Toggle */}
        <VratModeToggle enabled={vratMode} onToggle={handleVratToggle} />

        {/* Settings Links */}
        <div className="bg-white rounded-2xl border-2 border-border p-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-saffron/5 transition-colors"
          >
            <Shield className="h-5 w-5 text-saffron" />
            <div>
              <p className="text-sm font-semibold font-body text-foreground">Admin Panel</p>
              <p className="text-xs text-muted-foreground font-body">Manage content (admins only)</p>
            </div>
          </Link>
          <div className="flex items-center gap-3 p-3 rounded-xl">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold font-body text-foreground">App Version</p>
              <p className="text-xs text-muted-foreground font-body">Sanatan Pro v1.0</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground font-body">
            🙏 Jai Shri Ram — Sanatan Pro
          </p>
          <p className="text-xs text-muted-foreground font-body mt-1">
            © {new Date().getFullYear()} Built with{' '}
            <span className="text-saffron">🙏</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'sanatan-pro'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
