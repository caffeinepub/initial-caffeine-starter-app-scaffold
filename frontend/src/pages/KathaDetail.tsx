import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Copy, Share2 } from 'lucide-react';
import { staticKathaData } from '../lib/kathaData';
import { useSpeechNarration } from '../hooks/useSpeechNarration';

export default function KathaDetail() {
  const { id } = useParams({ from: '/katha/$id' });
  const navigate = useNavigate();
  const [showHindi, setShowHindi] = useState(true);
  const [copied, setCopied] = useState(false);

  const katha = staticKathaData.find(
    (k) => String(k.id) === String(id) || k.id === BigInt(id)
  );

  const textToDisplay = katha
    ? showHindi
      ? katha.hindiText
      : katha.englishText
    : '';

  const { narrationState, speak, stop } = useSpeechNarration();
  const isPlaying = narrationState === 'playing';
  const isPaused = narrationState === 'paused';

  const handleCopy = async () => {
    if (!katha) return;
    await navigator.clipboard.writeText(textToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!katha) return;
    const text = `📖 ${katha.title}\n\n${textToDisplay.substring(0, 300)}...`;
    if (navigator.share) {
      await navigator.share({ title: katha.title, text });
    } else {
      await handleCopy();
    }
  };

  const handleTTS = () => {
    if (isPlaying || isPaused) {
      stop();
    } else {
      speak(textToDisplay, `katha-${id}`);
    }
  };

  // Get banner based on category/deity
  const getBannerImage = () => {
    if (!katha) return '/assets/generated/kathayen-banner.dim_1200x400.png';
    const cat =
      typeof katha.category === 'string'
        ? katha.category
        : typeof katha.category === 'object' && katha.category !== null
        ? Object.keys(katha.category)[0]
        : '';
    if (cat === 'krishna') return '/assets/generated/krishna-leela-banner.dim_800x400.png';
    if (katha.deity?.toLowerCase().includes('ram')) return '/assets/generated/ramayan-banner.dim_800x400.png';
    if (katha.deity?.toLowerCase().includes('mahabharat')) return '/assets/generated/mahabharat-banner.dim_800x400.png';
    return '/assets/generated/kathayen-banner.dim_1200x400.png';
  };

  if (!katha) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-3">📖</div>
          <p className="text-foreground text-lg">कथा नहीं मिली</p>
          <button
            onClick={() => navigate({ to: '/kathayen' })}
            className="mt-4 px-4 py-2 rounded-full text-white text-sm bg-gradient-to-r from-saffron-600 to-gold-500"
          >
            वापस जाएँ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, #FF6B00, #FFD700)',
          boxShadow: '0 2px 10px rgba(255,107,0,0.3)',
        }}
      >
        <button
          onClick={() => navigate({ to: '/kathayen' })}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.25)' }}
        >
          <ChevronLeft size={18} color="white" />
        </button>
        <div className="flex-1 min-w-0">
          <h1
            className="text-white font-bold text-base truncate"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            {katha.title}
          </h1>
        </div>
        <span className="text-xl">📖</span>
      </div>

      {/* Banner */}
      <div
        className="relative h-32 overflow-hidden"
        style={{
          backgroundImage: `url(${getBannerImage()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(255,107,0,0.3), rgba(0,0,0,0.7))' }}
        />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(255,107,0,0.9)', color: 'white' }}
            >
              {katha.deity}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
        {/* Hindi/English Toggle */}
        <div
          className="flex rounded-full overflow-hidden"
          style={{ border: '1.5px solid #FFD700' }}
        >
          <button
            onClick={() => setShowHindi(true)}
            className="px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background: showHindi ? 'linear-gradient(135deg, #FF6B00, #FFD700)' : 'transparent',
              color: showHindi ? 'white' : '#8B3A00',
            }}
          >
            हिंदी
          </button>
          <button
            onClick={() => setShowHindi(false)}
            className="px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background: !showHindi ? 'linear-gradient(135deg, #FF6B00, #FFD700)' : 'transparent',
              color: !showHindi ? 'white' : '#8B3A00',
            }}
          >
            English
          </button>
        </div>

        {/* TTS */}
        <button
          onClick={handleTTS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: (isPlaying || isPaused)
              ? 'linear-gradient(135deg, #C0392B, #E74C3C)'
              : 'linear-gradient(135deg, #FF6B00, #FFD700)',
            color: 'white',
          }}
        >
          {(isPlaying || isPaused) ? '⏹ रोकें' : '▶ सुनें'}
        </button>

        {/* Copy */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: copied ? 'rgba(255,107,0,0.2)' : 'rgba(255,215,0,0.15)',
            color: '#8B3A00',
            border: '1px solid #FFD700',
          }}
        >
          <Copy size={12} />
          {copied ? 'कॉपी!' : 'कॉपी'}
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: 'rgba(192,57,43,0.1)',
            color: '#C0392B',
            border: '1px solid rgba(192,57,43,0.3)',
          }}
        >
          <Share2 size={12} />
          शेयर
        </button>
      </div>

      {/* Katha Text */}
      <div className="px-4 pb-6">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF3D4 100%)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 20px rgba(255,215,0,0.2)',
          }}
        >
          <div className="absolute top-2 left-2 text-lg opacity-30" style={{ color: '#FFD700' }}>✦</div>
          <div className="absolute top-2 right-2 text-lg opacity-30" style={{ color: '#FFD700' }}>✦</div>
          <p
            className="text-base leading-loose whitespace-pre-line"
            style={{ color: '#5D2E0C' }}
          >
            {textToDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}
