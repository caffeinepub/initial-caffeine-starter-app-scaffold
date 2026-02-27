import React, { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSetUserProfile, useGetJapStats } from '../hooks/useQueries';
import { Mantra } from '../backend';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Loader from '../components/Loader';

const MANTRA_OPTIONS = [
  { key: 'omNamahShivaya', hindi: 'ॐ नमः शिवाय', english: 'Om Namah Shivaya', deity: 'शिव', emoji: '🔱' },
  { key: 'hareKrishna', hindi: 'हरे कृष्ण हरे कृष्ण', english: 'Hare Krishna', deity: 'कृष्ण', emoji: '🦚' },
  { key: 'gayatriMantra', hindi: 'ॐ भूर्भुवः स्वः', english: 'Gayatri Mantra', deity: 'सूर्य', emoji: '☀️' },
  { key: 'mahamrityunjayaMantra', hindi: 'ॐ त्र्यम्बकं यजामहे', english: 'Mahamrityunjaya', deity: 'शिव', emoji: '🌙' },
  { key: 'saiRam', hindi: 'ॐ साईं राम', english: 'Sai Ram', deity: 'साईं बाबा', emoji: '🙏' },
  { key: 'sitaram', hindi: 'सीताराम सीताराम', english: 'Sita Ram', deity: 'राम', emoji: '🏹' },
  { key: 'omMantra', hindi: 'ॐ', english: 'Om Mantra', deity: 'ब्रह्म', emoji: '🕉️' },
];

function getStoredMantra(): string {
  return localStorage.getItem('selectedMantra') || 'omNamahShivaya';
}

export default function Profile() {
  const { identity, clear } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: japStats } = useGetJapStats();
  const setUserProfile = useSetUserProfile();

  const [isVratMode, setIsVratMode] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState<string>(getStoredMantra());
  const [isSavingMantra, setIsSavingMantra] = useState(false);

  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && userProfile?.selectedMantra) {
      setSelectedMantra(userProfile.selectedMantra as string);
    } else if (!isAuthenticated) {
      setSelectedMantra(getStoredMantra());
    }
  }, [isAuthenticated, userProfile]);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML = `
      atOptions = {
        'key' : '3d7a4183dc9896593608ed10d4da6100',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://www.highperformanceformat.com/3d7a4183dc9896593608ed10d4da6100/invoke.js';

    container.appendChild(script1);
    container.appendChild(script2);

    return () => {
      if (container.contains(script1)) container.removeChild(script1);
      if (container.contains(script2)) container.removeChild(script2);
    };
  }, []);

  const handleMantraSelect = async (mantraKey: string) => {
    setSelectedMantra(mantraKey);

    if (isAuthenticated && userProfile) {
      setIsSavingMantra(true);
      try {
        await setUserProfile.mutateAsync({
          name: userProfile.name,
          selectedMantra: mantraKey as Mantra,
        });
        toast.success('मंत्र सहेजा गया! 🙏');
      } catch (e) {
        toast.error('मंत्र सहेजने में त्रुटि');
      } finally {
        setIsSavingMantra(false);
      }
    } else {
      localStorage.setItem('selectedMantra', mantraKey);
      window.dispatchEvent(new Event('storage'));
      toast.success('मंत्र चुना गया! 🙏');
    }
  };

  const handleLogout = async () => {
    await clear();
  };

  if (isAuthenticated && profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, oklch(0.97 0.025 85) 0%, oklch(0.93 0.04 80) 100%)'
      }}>
        <Loader text="प्रोफ़ाइल लोड हो रही है..." />
      </div>
    );
  }

  const displayName = userProfile?.name || 'भक्त';
  const principal = identity?.getPrincipal().toString() || '';

  return (
    <div className="min-h-screen relative overflow-hidden pb-24" style={{
      background: 'linear-gradient(180deg, oklch(0.97 0.025 85) 0%, oklch(0.93 0.04 80) 100%)'
    }}>
      {/* Mandala background */}
      <div className="mandala-bg" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6 animate-divine-entrance">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img
              src="/assets/generated/om-symbol.dim_256x256.png"
              alt="Om"
              className="w-6 h-6 animate-mandala-spin"
              style={{ filter: 'sepia(1) saturate(3) hue-rotate(10deg)' }}
            />
            <h1 className="font-heading text-2xl" style={{ color: 'oklch(0.35 0.14 20)' }}>
              मेरी प्रोफ़ाइल
            </h1>
          </div>
        </div>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-3 animate-golden-halo"
            style={{
              background: 'linear-gradient(135deg, oklch(0.82 0.18 80), oklch(0.72 0.19 55))',
              border: '3px solid oklch(0.82 0.18 80)',
            }}
          >
            🙏
          </div>
          <h2 className="font-heading text-2xl" style={{ color: 'oklch(0.35 0.14 20)' }}>
            {displayName}
          </h2>
          {isAuthenticated && (
            <p className="text-xs mt-1 font-mono" style={{ color: 'oklch(0.55 0.05 40)' }}>
              {principal.slice(0, 20)}...
            </p>
          )}
          {!isAuthenticated && (
            <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.05 40)' }}>
              अतिथि भक्त
            </p>
          )}
        </div>

        {/* Jap Stats */}
        {isAuthenticated && japStats && (
          <div className="mb-6">
            <div className="sacred-divider">
              <span className="sacred-divider-text">🕉️</span>
            </div>
            <h3 className="font-heading text-center text-lg mb-3" style={{ color: 'oklch(0.35 0.14 20)' }}>
              जप आँकड़े
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'आज', value: Number(japStats.daily) },
                { label: 'इस सप्ताह', value: Number(japStats.weekly) },
                { label: 'कुल', value: Number(japStats.lifetime) },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="text-center p-3 rounded-xl devotional-card"
                >
                  <div className="font-heading text-2xl" style={{ color: 'oklch(0.62 0.18 45)' }}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'oklch(0.48 0.05 40)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mantra Selection */}
        <div className="mb-6">
          <div className="sacred-divider">
            <span className="sacred-divider-text">🔱</span>
          </div>
          <h3 className="font-heading text-center text-lg mb-1" style={{ color: 'oklch(0.35 0.14 20)' }}>
            अपना मंत्र चुनें
          </h3>
          <p className="text-center text-xs mb-4" style={{ color: 'oklch(0.55 0.05 40)' }}>
            यह मंत्र जप पृष्ठ पर उपयोग होगा
          </p>

          {isSavingMantra && (
            <div className="text-center mb-3">
              <span className="text-sm animate-pulse" style={{ color: 'oklch(0.62 0.18 45)' }}>
                मंत्र सहेजा जा रहा है...
              </span>
            </div>
          )}

          <div className="space-y-2">
            {MANTRA_OPTIONS.map(mantra => {
              const isSelected = selectedMantra === mantra.key;
              return (
                <button
                  key={mantra.key}
                  onClick={() => handleMantraSelect(mantra.key)}
                  disabled={isSavingMantra}
                  className="w-full text-left p-4 rounded-xl transition-all duration-200"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, oklch(0.82 0.18 80 / 0.2), oklch(0.72 0.19 55 / 0.1))'
                      : 'oklch(0.97 0.025 85)',
                    border: isSelected
                      ? '2px solid oklch(0.82 0.18 80 / 0.7)'
                      : '1px solid oklch(0.82 0.18 80 / 0.2)',
                    boxShadow: isSelected
                      ? '0 0 15px oklch(0.82 0.18 80 / 0.2)'
                      : 'none',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mantra.emoji}</span>
                    <div className="flex-1">
                      <p className="font-heading text-base" style={{ color: isSelected ? 'oklch(0.62 0.18 45)' : 'oklch(0.35 0.14 20)' }}>
                        {mantra.hindi}
                      </p>
                      <p className="text-xs" style={{ color: 'oklch(0.55 0.05 40)' }}>
                        {mantra.english} • {mantra.deity}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ background: 'oklch(0.62 0.18 45)', color: 'white' }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vrat Mode */}
        <div className="mb-6">
          <div className="sacred-divider">
            <span className="sacred-divider-text">🌙</span>
          </div>
          <div
            className="p-4 rounded-xl devotional-card flex items-center justify-between"
          >
            <div>
              <h3 className="font-heading text-base" style={{ color: 'oklch(0.35 0.14 20)' }}>
                व्रत मोड
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'oklch(0.55 0.05 40)' }}>
                व्रत के दिन विशेष सामग्री दिखाएं
              </p>
            </div>
            <Switch
              checked={isVratMode}
              onCheckedChange={setIsVratMode}
            />
          </div>
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <div className="text-center mb-6">
            <button
              onClick={handleLogout}
              className="px-8 py-3 rounded-full font-medium transition-all"
              style={{
                background: 'oklch(0.55 0.22 25 / 0.1)',
                border: '1px solid oklch(0.55 0.22 25 / 0.3)',
                color: 'oklch(0.55 0.22 25)',
              }}
            >
              लॉगआउट
            </button>
          </div>
        )}

        {/* Ad Banner */}
        <div className="flex justify-center mt-4" ref={adContainerRef} />
      </div>
    </div>
  );
}
