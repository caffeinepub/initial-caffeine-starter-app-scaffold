import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetDharmaQuote, useGetFestivals } from '../hooks/useQueries';
import { getTithi, getNakshatra, getVara } from '../lib/panchangEngine';
import { AARTIS, SHLOKAS } from '../lib/staticData';
import FloatingLotus from '../components/FloatingLotus';
import GoldenHalo from '../components/GoldenHalo';
import Loader from '../components/Loader';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'शुभ प्रभात 🌅';
  if (hour < 17) return 'जय श्री राम 🙏';
  return 'शुभ संध्या 🌙';
}

interface TodayPanchang {
  tithi: string;
  paksha: string;
  nakshatra: string;
  vara: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { data: dharmaQuote, isLoading: quoteLoading } = useGetDharmaQuote();
  const { data: festivals } = useGetFestivals();

  const [todayPanchang, setTodayPanchang] = useState<TodayPanchang | null>(null);

  useEffect(() => {
    const today = new Date();
    const tithiData = getTithi(today);
    const nakshatraData = getNakshatra(today);
    const varaData = getVara(today);

    setTodayPanchang({
      tithi: tithiData.name,
      paksha: tithiData.paksha,
      nakshatra: nakshatraData.name,
      vara: varaData.name,
    });
  }, []);

  const todayShloka = SHLOKAS[new Date().getDate() % SHLOKAS.length];
  const featuredAartis = AARTIS.slice(0, 6);

  return (
    <div className="min-h-screen relative overflow-hidden pb-24">
      {/* Floating Lotus Petals */}
      <FloatingLotus />

      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, oklch(0.97 0.025 85) 0%, oklch(0.94 0.04 80) 100%)',
          zIndex: -1,
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, oklch(0.35 0.14 20) 0%, oklch(0.45 0.16 30) 40%, oklch(0.55 0.18 45) 70%, oklch(0.35 0.14 20) 100%)',
          }}
        />
        <div className="mandala-bg" style={{ opacity: 0.08 }} />

        {/* Light rays */}
        <div
          className="absolute inset-0 animate-light-rays pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, oklch(0.82 0.18 80 / 0.15) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 px-4 py-10 text-center">
          {/* Diya */}
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/diya-glow.dim_200x200.png"
              alt="Diya"
              className="w-20 h-20 object-contain animate-diya-flicker animate-float"
            />
          </div>

          <p
            className="text-sm mb-2 animate-divine-entrance"
            style={{ color: 'oklch(0.82 0.18 80)', animationDelay: '0.1s' }}
          >
            {getGreeting()}
          </p>

          <h1
            className="font-heading text-4xl mb-2 animate-divine-entrance"
            style={{
              color: '#FFD700',
              textShadow: '0 0 30px oklch(0.82 0.18 80 / 0.6)',
              animationDelay: '0.2s',
            }}
          >
            🕉️ श्री हरि ॐ
          </h1>

          <p
            className="text-sm mb-6 animate-divine-entrance"
            style={{ color: 'oklch(0.88 0.06 75)', animationDelay: '0.3s' }}
          >
            आपका आध्यात्मिक साथी
          </p>

          {/* Panchang Info */}
          {todayPanchang && (
            <div
              className="inline-flex flex-wrap justify-center gap-3 px-6 py-3 rounded-2xl animate-divine-entrance"
              style={{
                background: 'oklch(0.82 0.18 80 / 0.12)',
                border: '1px solid oklch(0.82 0.18 80 / 0.3)',
                animationDelay: '0.4s',
              }}
            >
              <div className="text-center">
                <p className="text-xs" style={{ color: 'oklch(0.82 0.18 80 / 0.7)' }}>तिथि</p>
                <p className="font-heading text-sm" style={{ color: '#FFD700' }}>
                  {todayPanchang.paksha === 'शुक्ल पक्ष' ? 'शुक्ल' : 'कृष्ण'} {todayPanchang.tithi}
                </p>
              </div>
              <div className="w-px self-stretch" style={{ background: 'oklch(0.82 0.18 80 / 0.3)' }} />
              <div className="text-center">
                <p className="text-xs" style={{ color: 'oklch(0.82 0.18 80 / 0.7)' }}>नक्षत्र</p>
                <p className="font-heading text-sm" style={{ color: '#FFD700' }}>
                  {todayPanchang.nakshatra}
                </p>
              </div>
              <div className="w-px self-stretch" style={{ background: 'oklch(0.82 0.18 80 / 0.3)' }} />
              <div className="text-center">
                <p className="text-xs" style={{ color: 'oklch(0.82 0.18 80 / 0.7)' }}>वार</p>
                <p className="font-heading text-sm" style={{ color: '#FFD700' }}>
                  {todayPanchang.vara}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-lg mx-auto px-4">
        {/* Quick Actions */}
        <section className="mt-6 animate-divine-entrance" style={{ animationDelay: '0.5s' }}>
          <div className="sacred-divider">
            <span className="sacred-divider-text">🙏</span>
          </div>
          <h2 className="font-heading text-xl text-center mb-4" style={{ color: 'oklch(0.35 0.14 20)' }}>
            त्वरित पहुँच
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '📿', label: 'जप', path: '/jap' },
              { icon: '📖', label: 'पंचांग', path: '/panchang' },
              { icon: '🛕', label: 'मंदिर', path: '/mandir' },
              { icon: '🤖', label: 'AI गुरु', path: '/ai-guru' },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl devotional-card"
              >
                <GoldenHalo size="sm">
                  <span className="text-2xl">{item.icon}</span>
                </GoldenHalo>
                <span className="text-xs font-medium" style={{ color: 'oklch(0.35 0.14 20)' }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Aarti Section */}
        <section className="mt-6">
          <div className="sacred-divider">
            <span className="sacred-divider-text">🪔</span>
          </div>
          <h2 className="font-heading text-xl text-center mb-4" style={{ color: 'oklch(0.35 0.14 20)' }}>
            आरती संग्रह
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {featuredAartis.map(aarti => (
              <button
                key={aarti.id}
                onClick={() => navigate({ to: `/aarti/${aarti.id}` })}
                className="devotional-card rounded-2xl p-3 text-center"
              >
                <GoldenHalo size="sm" className="mx-auto mb-2">
                  <span className="text-2xl">{aarti.emoji}</span>
                </GoldenHalo>
                <p className="text-xs font-medium leading-tight" style={{ color: 'oklch(0.35 0.14 20)' }}>
                  {aarti.name.replace(' Aarti', '')}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Today's Shloka */}
        {todayShloka && (
          <section className="mt-6">
            <div className="sacred-divider">
              <span className="sacred-divider-text">📜</span>
            </div>
            <h2 className="font-heading text-xl text-center mb-4" style={{ color: 'oklch(0.35 0.14 20)' }}>
              आज का श्लोक
            </h2>
            <div
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, oklch(0.97 0.025 85), oklch(0.94 0.04 80))',
                border: '1px solid oklch(0.82 0.18 80 / 0.4)',
                boxShadow: '0 4px 20px oklch(0.62 0.18 45 / 0.1)',
              }}
            >
              <div className="mandala-bg" style={{ opacity: 0.05 }} />
              <p
                className="font-devanagari text-base text-center relative z-10 mb-3"
                style={{ color: 'oklch(0.35 0.14 20)' }}
              >
                {todayShloka.sanskrit}
              </p>
              <div className="sacred-divider" style={{ margin: '0.5rem 0' }}>
                <span className="sacred-divider-text text-sm">🕉️</span>
              </div>
              <p className="text-sm text-center relative z-10" style={{ color: 'oklch(0.48 0.05 40)' }}>
                {todayShloka.hindiMeaning}
              </p>
            </div>
          </section>
        )}

        {/* Dharma Quote */}
        <section className="mt-6">
          <div className="sacred-divider">
            <span className="sacred-divider-text">✨</span>
          </div>
          <h2 className="font-heading text-xl text-center mb-4" style={{ color: 'oklch(0.35 0.14 20)' }}>
            धर्म वचन
          </h2>
          {quoteLoading ? (
            <Loader size="sm" />
          ) : dharmaQuote ? (
            <div
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.45 0.16 30))',
                border: '1px solid oklch(0.82 0.18 80 / 0.3)',
              }}
            >
              <div className="mandala-bg" style={{ opacity: 0.06 }} />
              <p className="font-heading text-lg text-center relative z-10 mb-2" style={{ color: '#FFD700' }}>
                "{dharmaQuote.hindiText}"
              </p>
              <p className="text-sm text-center relative z-10" style={{ color: 'oklch(0.82 0.18 80 / 0.7)' }}>
                — {dharmaQuote.author}
              </p>
            </div>
          ) : (
            <div
              className="p-5 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.45 0.16 30))',
                border: '1px solid oklch(0.82 0.18 80 / 0.3)',
              }}
            >
              <p className="font-heading text-lg" style={{ color: '#FFD700' }}>
                "धर्मो रक्षति रक्षितः"
              </p>
              <p className="text-sm mt-2" style={{ color: 'oklch(0.82 0.18 80 / 0.7)' }}>
                — मनुस्मृति
              </p>
            </div>
          )}
        </section>

        {/* Festivals */}
        {festivals && festivals.length > 0 && (
          <section className="mt-6">
            <div className="sacred-divider">
              <span className="sacred-divider-text">🎉</span>
            </div>
            <h2 className="font-heading text-xl text-center mb-4" style={{ color: 'oklch(0.35 0.14 20)' }}>
              आगामी त्योहार
            </h2>
            <div className="space-y-2">
              {festivals.slice(0, 3).map((festival, idx) => (
                <div
                  key={idx}
                  className="devotional-card p-4 rounded-xl flex items-center gap-3"
                >
                  <span className="text-2xl">🎊</span>
                  <div>
                    <p className="font-heading text-base" style={{ color: 'oklch(0.35 0.14 20)' }}>
                      {festival.name}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.55 0.05 40)' }}>
                      {festival.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigate to Kathayen */}
        <section className="mt-6 mb-4">
          <button
            onClick={() => navigate({ to: '/kathayen' })}
            className="w-full p-4 rounded-2xl text-center transition-all"
            style={{
              background: 'linear-gradient(135deg, oklch(0.62 0.18 45), oklch(0.72 0.19 55))',
              border: '1px solid oklch(0.82 0.18 80 / 0.3)',
              boxShadow: '0 4px 20px oklch(0.62 0.18 45 / 0.3)',
            }}
          >
            <p className="font-heading text-xl" style={{ color: '#FFF8DC' }}>
              📚 कथाएँ पढ़ें
            </p>
            <p className="text-sm mt-1" style={{ color: 'oklch(0.94 0.04 80 / 0.8)' }}>
              पौराणिक और व्रत कथाएँ
            </p>
          </button>
        </section>
      </div>
    </div>
  );
}
