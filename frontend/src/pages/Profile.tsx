import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSetUserProfile } from '../hooks/useQueries';
import { Mantra } from '../backend';
import { User, Star, BookOpen, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import VratModeToggle from '../components/VratModeToggle';
import VratModeDashboard from '../components/VratModeDashboard';

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

export default function Profile() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { mutate: setUserProfile } = useSetUserProfile();

  const [selectedMantra, setSelectedMantra] = useState<Mantra>(Mantra.omNamahShivaya);
  const [vratModeEnabled, setVratModeEnabled] = useState(false);

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

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const isAuthenticated = !!identity;
  const principalId = identity?.getPrincipal().toString();
  const displayName = userProfile?.name || 'भक्त';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6 pb-24">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">प्रोफ़ाइल</h2>
          <p className="text-muted-foreground text-sm mt-1">
            अपनी प्रोफ़ाइल देखने के लिए लॉगिन करें
          </p>
        </div>
      </div>
    );
  }

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
              {principalId && (
                <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate max-w-[200px]">
                  {principalId.slice(0, 20)}...
                </p>
              )}
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Star, label: 'जाप', value: '—' },
            { icon: BookOpen, label: 'कथाएं', value: '—' },
            { icon: Heart, label: 'आरती', value: '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-3 text-center">
              <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
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

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          लॉगआउट
        </Button>
      </div>
    </div>
  );
}
