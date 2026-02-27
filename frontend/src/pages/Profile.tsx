import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSetUserProfile, useGetJapStats } from '../hooks/useQueries';
import { Mantra } from '../backend';
import { User, Settings, Flame, Heart, BookOpen, Bell, BellOff, BellRing } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import VratModeToggle from '../components/VratModeToggle';
import VratModeDashboard from '../components/VratModeDashboard';
import { useDailyNotifications } from '../hooks/useDailyNotifications';

const MANTRA_LABELS: Record<Mantra, string> = {
  [Mantra.omNamahShivaya]: 'ॐ नमः शिवाय',
  [Mantra.hareKrishna]: 'हरे कृष्ण हरे राम',
  [Mantra.gayatriMantra]: 'गायत्री मंत्र',
  [Mantra.mahamrityunjayaMantra]: 'महामृत्युंजय मंत्र',
  [Mantra.saiRam]: 'साईं राम',
  [Mantra.sitaram]: 'सीताराम',
  [Mantra.omMantra]: 'ॐ',
  [Mantra.radhaNamJap]: 'राधे राधे',
  [Mantra.jaiShreeRamNamJap]: 'जय श्री राम',
};

const VRAT_MODE_KEY = 'vrat-mode-enabled';

const PERMISSION_LABELS: Record<string, { label: string; color: string }> = {
  granted: { label: 'अनुमति दी गई ✓', color: 'text-green-400' },
  denied: { label: 'अनुमति अस्वीकृत ✗', color: 'text-red-400' },
  default: { label: 'अनुमति नहीं दी गई', color: 'text-amber-400' },
  unsupported: { label: 'ब्राउज़र में उपलब्ध नहीं', color: 'text-muted-foreground' },
};

export default function Profile() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutate: setUserProfile } = useSetUserProfile();
  const { data: japStats, isLoading: japStatsLoading } = useGetJapStats();

  const [selectedMantra, setSelectedMantra] = useState<Mantra>(Mantra.omNamahShivaya);
  const [vratModeEnabled, setVratModeEnabled] = useState(false);

  const {
    isEnabled: notificationsEnabled,
    permissionStatus,
    enableNotifications,
    disableNotifications,
    isSupported: notificationsSupported,
  } = useDailyNotifications();

  // Load vrat mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(VRAT_MODE_KEY);
    setVratModeEnabled(stored === 'true');
  }, []);

  // Sync mantra from profile
  useEffect(() => {
    if (userProfile?.selectedMantra) {
      setSelectedMantra(userProfile.selectedMantra);
    }
  }, [userProfile]);

  const handleVratModeToggle = (enabled: boolean) => {
    setVratModeEnabled(enabled);
    localStorage.setItem(VRAT_MODE_KEY, String(enabled));
  };

  const handleMantraChange = (mantra: Mantra) => {
    setSelectedMantra(mantra);
    if (userProfile) {
      setUserProfile({ ...userProfile, selectedMantra: mantra });
    }
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      await enableNotifications();
    } else {
      disableNotifications();
    }
  };

  const displayName = userProfile?.name || 'भक्त';

  const lifetimeCount = japStats ? Number(japStats.lifetime) : 0;
  const malaCount = japStats ? Number(japStats.mala) : 0;
  const streakCount = japStats ? Number(japStats.streak) : 0;

  const permInfo = PERMISSION_LABELS[permissionStatus] ?? PERMISSION_LABELS['default'];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background px-4 pt-8 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">भक्त</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">
        {/* Radha Rani Banner */}
        <a
          href="https://www.iskcon.org"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg group">
            <img
              src="/assets/generated/radha-rani-banner.dim_800x300.png"
              alt="Radha Rani"
              className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center px-4">
              <div>
                <p className="text-white font-bold text-sm drop-shadow">राधे राधे 🌸</p>
                <p className="text-white/80 text-xs">श्री राधा रानी की कृपा सदा बनी रहे</p>
              </div>
            </div>
            <div className="absolute inset-0 ring-2 ring-amber-400/0 group-hover:ring-amber-400/60 rounded-2xl transition-all" />
          </div>
        </a>

        {/* Devotional Stats — Lifetime & Streak (read-only) */}
        <div className="bg-gradient-to-br from-amber-900/60 to-orange-900/40 border border-amber-700/40 rounded-2xl p-4">
          <p className="text-xs text-amber-300/70 uppercase tracking-widest mb-3 font-medium">
            🙏 भक्ति आँकड़े
          </p>
          {japStatsLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {/* Lifetime Nam Jap */}
              <div className="bg-black/20 rounded-xl p-3 text-center">
                <Heart className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-amber-300 tabular-nums">
                  {lifetimeCount.toLocaleString('hi-IN')}
                </p>
                <p className="text-xs text-amber-200/60 mt-0.5 leading-tight">जीवन जप</p>
              </div>

              {/* Total Malas */}
              <div className="bg-black/20 rounded-xl p-3 text-center">
                <BookOpen className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-amber-300 tabular-nums">
                  {malaCount.toLocaleString('hi-IN')}
                </p>
                <p className="text-xs text-amber-200/60 mt-0.5 leading-tight">कुल माला</p>
              </div>

              {/* Streak */}
              <div className="bg-black/20 rounded-xl p-3 text-center">
                <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1 animate-pulse" />
                <p className="text-xl font-bold text-orange-300 tabular-nums">
                  {streakCount}
                </p>
                <p className="text-xs text-amber-200/60 mt-0.5 leading-tight">दिन स्ट्रीक</p>
              </div>
            </div>
          )}
          <p className="text-xs text-amber-200/30 text-center mt-3">
            ये आँकड़े स्थायी हैं और रीसेट नहीं होते
          </p>
        </div>

        {/* Daily Notifications Settings */}
        <div
          className="rounded-2xl border p-4"
          style={{
            background: 'linear-gradient(135deg, oklch(0.28 0.10 20 / 0.8), oklch(0.32 0.12 30 / 0.6))',
            borderColor: notificationsEnabled
              ? 'oklch(0.82 0.18 80 / 0.5)'
              : 'oklch(0.82 0.18 80 / 0.2)',
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {notificationsEnabled ? (
                <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <Bell className="w-4 h-4 text-amber-400/60" />
              )}
              <h3 className="font-semibold text-amber-200 text-sm">दैनिक स्मरण सूचनाएं</h3>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
              disabled={!notificationsSupported}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>

          {/* Description */}
          <p className="text-xs text-amber-200/60 mb-3 leading-relaxed">
            दिन में <span className="text-amber-300 font-semibold">7 बार</span> स्मरण सूचनाएं मिलेंगी —
            नाम जप, आरती और व्रत के लिए।{' '}
            <span className="text-amber-200/40">
              (7 daily reminders for Nam Jap, Aarti &amp; Vrat)
            </span>
          </p>

          {/* Notification times */}
          {notificationsEnabled && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['6:00', '8:00', '10:00', '12:00', '15:00', '18:00', '21:00'].map((time, i) => {
                const icons = ['🌅', '🕉️', '🙏', '🪔', '📿', '🌇', '🌙'];
                return (
                  <span
                    key={time}
                    className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  >
                    {icons[i]} {time}
                  </span>
                );
              })}
            </div>
          )}

          {/* Permission status */}
          <div className="flex items-center gap-1.5">
            {permissionStatus === 'denied' ? (
              <BellOff className="w-3 h-3 text-red-400" />
            ) : (
              <Bell className="w-3 h-3 text-amber-400/60" />
            )}
            <span className={`text-xs ${permInfo.color}`}>{permInfo.label}</span>
          </div>

          {/* Denied instructions */}
          {permissionStatus === 'denied' && (
            <p className="text-xs text-amber-200/40 mt-2 leading-relaxed">
              ब्राउज़र सेटिंग में जाकर नोटिफिकेशन की अनुमति दें।
              In-app reminders will still appear while the app is open.
            </p>
          )}

          {/* Unsupported */}
          {!notificationsSupported && (
            <p className="text-xs text-muted-foreground mt-2">
              आपका ब्राउज़र नोटिफिकेशन को सपोर्ट नहीं करता।
            </p>
          )}
        </div>

        {/* Vrat Mode Toggle */}
        <VratModeToggle enabled={vratModeEnabled} onToggle={handleVratModeToggle} />

        {/* Vrat Mode Dashboard */}
        {vratModeEnabled && <VratModeDashboard />}

        {/* Mantra Selection */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">मंत्र चुनें</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(MANTRA_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleMantraChange(key as Mantra)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                  selectedMantra === key
                    ? 'bg-primary/10 border border-primary/40 text-primary font-medium'
                    : 'bg-muted/50 border border-transparent text-foreground hover:bg-muted'
                }`}
              >
                <span>{label}</span>
                {selectedMantra === key && (
                  <span className="text-primary text-xs">✓ चयनित</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
