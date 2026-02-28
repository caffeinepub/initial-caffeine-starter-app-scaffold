import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetJapStats, useIsAdmin, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import VratModeToggle from '../components/VratModeToggle';
import { Skeleton } from '@/components/ui/skeleton';

export default function Profile() {
  const { data: japStats, isLoading: statsLoading } = useGetJapStats();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const [vratMode, setVratMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('vratMode');
    setVratMode(stored === 'true');
  }, []);

  const handleVratToggle = (enabled: boolean) => {
    setVratMode(enabled);
    localStorage.setItem('vratMode', String(enabled));
  };

  const lifetimeJaps = japStats ? Number(japStats.lifetime) : 0;
  const malaCount = Math.floor(lifetimeJaps / 108);
  const isAuthenticated = !!identity;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-b from-saffron-800 to-background px-4 pt-6 pb-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-600 to-gold-500 flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg ring-4 ring-gold-500/30">
          🙏
        </div>
        {profileLoading ? (
          <Skeleton className="h-6 w-32 mx-auto mb-1" />
        ) : (
          <h1 className="text-xl font-bold text-white">
            {userProfile?.name ? `🙏 ${userProfile.name}` : 'भक्त प्रोफाइल'}
          </h1>
        )}
        <p className="text-amber-200 text-sm mt-1">आपकी भक्ति यात्रा</p>
        {isAuthenticated && userProfile?.selectedMantra && (
          <div className="mt-2 inline-block bg-white/10 border border-white/20 rounded-full px-3 py-1">
            <p className="text-amber-100 text-xs">
              🕉️ {getMantraLabel(String(userProfile.selectedMantra))}
            </p>
          </div>
        )}
        {/* Admin badge */}
        {isAuthenticated && !adminLoading && isAdmin && (
          <div className="mt-2 inline-block bg-gold-500/20 border border-gold-500/40 rounded-full px-3 py-1 ml-2">
            <p className="text-gold-400 text-xs">👑 Admin</p>
          </div>
        )}
      </div>

      <div className="px-4 space-y-4 pb-8">
        {/* Lifetime Stats */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-foreground font-bold mb-3 flex items-center gap-2">
            <span>⭐</span> जीवन भर के आंकड़े
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-500/20 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">🕉️</p>
              {statsLoading ? (
                <Skeleton className="h-7 w-16 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-gold-400">{lifetimeJaps.toLocaleString('hi-IN')}</p>
              )}
              <p className="text-xs text-muted-foreground">कुल नाम जाप</p>
            </div>
            <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-500/20 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">📿</p>
              {statsLoading ? (
                <Skeleton className="h-7 w-16 mx-auto mb-1" />
              ) : (
                <p className="text-2xl font-bold text-gold-400">{malaCount.toLocaleString('hi-IN')}</p>
              )}
              <p className="text-xs text-muted-foreground">माला पूर्ण (108)</p>
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-foreground font-bold mb-3 flex items-center gap-2">
            <span>📊</span> आज के आंकड़े
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'आज का जाप', value: statsLoading ? null : (japStats ? Number(japStats.daily) : 0), emoji: '📅' },
              { label: 'स्ट्रीक', value: statsLoading ? null : (japStats ? `${Number(japStats.streak)} दिन` : '0 दिन'), emoji: '🔥' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-muted/50 rounded-xl p-3 text-center hover:scale-105 transition-all duration-200"
              >
                <p className="text-xl mb-1">{stat.emoji}</p>
                {stat.value === null ? (
                  <Skeleton className="h-6 w-12 mx-auto mb-1" />
                ) : (
                  <p className="text-lg font-bold text-gold-400">{stat.value}</p>
                )}
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          {!isAuthenticated && (
            <p className="text-center text-muted-foreground text-xs mt-3 bg-muted/30 rounded-lg p-2">
              🔐 जाप आंकड़े देखने के लिए Login करें
            </p>
          )}
        </div>

        {/* Vrat Mode */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-foreground font-bold mb-3 flex items-center gap-2">
            <span>🙏</span> व्रत मोड
          </h2>
          <VratModeToggle enabled={vratMode} onToggle={handleVratToggle} />
          {vratMode && (
            <Link
              to="/vrat-dashboard"
              className="mt-3 block w-full bg-gradient-to-r from-amber-700 to-amber-500 text-white py-2 rounded-xl text-sm font-medium text-center hover:scale-[1.02] transition-all duration-200"
            >
              📋 व्रत डैशबोर्ड देखें
            </Link>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-foreground font-bold mb-3 flex items-center gap-2">
            <span>🔗</span> त्वरित लिंक
          </h2>
          <div className="space-y-2">
            {[
              { path: '/jap', label: 'जाप करें', emoji: '📿' },
              { path: '/aarti', label: 'आरती', emoji: '🪔' },
              { path: '/kathayen', label: 'कथाएं', emoji: '📖' },
              { path: '/community', label: 'समुदाय', emoji: '🤝' },
              { path: '/mandir', label: 'मंदिर खोजें', emoji: '🛕' },
              { path: '/ai-guru', label: 'AI गुरु', emoji: '🔮' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 hover:scale-[1.01]"
              >
                <span className="text-xl">{link.emoji}</span>
                <span className="text-foreground text-sm font-medium">{link.label}</span>
                <span className="ml-auto text-muted-foreground">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Panel Link — shown only when confirmed admin */}
        {isAuthenticated && !adminLoading && isAdmin && (
          <Link
            to="/admin"
            className="block bg-gradient-to-r from-gray-800 to-gray-700 border border-gold-500/30 rounded-2xl p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="text-white font-bold">Admin Panel</p>
                <p className="text-gray-300 text-xs">सामग्री और उपयोगकर्ता प्रबंधन</p>
              </div>
              <span className="ml-auto bg-gold-500/20 text-gold-400 text-xs px-2 py-1 rounded-full border border-gold-500/30">
                👑 Admin
              </span>
            </div>
          </Link>
        )}

        {/* App Info */}
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} श्री मंदिर • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function getMantraLabel(mantra: string): string {
  const labels: Record<string, string> = {
    omNamahShivaya: 'ॐ नमः शिवाय',
    hareKrishna: 'हरे कृष्ण',
    gayatriMantra: 'गायत्री मंत्र',
    mahamrityunjayaMantra: 'महामृत्युंजय मंत्र',
    saiRam: 'साईं राम',
    sitaram: 'सीताराम',
    omMantra: 'ॐ',
    radhaNamJap: 'राधे राधे',
    jaiShreeRamNamJap: 'जय श्री राम',
  };
  return labels[mantra] || mantra;
}
