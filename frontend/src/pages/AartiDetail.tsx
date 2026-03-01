import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Copy, Share2 } from 'lucide-react';
import { AARTIS } from '../lib/staticData';
import { useSpeechNarration } from '../hooks/useSpeechNarration';

export default function AartiDetail() {
  const { id } = useParams({ from: '/aarti/$id' });
  const navigate = useNavigate();
  const [showHindi, setShowHindi] = useState(true);
  const [copied, setCopied] = useState(false);

  const aarti = AARTIS.find((a) => String(a.id) === String(id));

  const textToDisplay = aarti
    ? showHindi
      ? aarti.hindiText
      : aarti.englishText
    : '';

  const { narrationState, startNarration, stopNarration } = useSpeechNarration();
  const isPlaying = narrationState === 'playing';
  const isPaused = narrationState === 'paused';

  const handleCopy = async () => {
    if (!aarti) return;
    await navigator.clipboard.writeText(textToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!aarti) return;
    const text = `🪔 ${aarti.name}\n\n${textToDisplay}`;
    if (navigator.share) {
      await navigator.share({ title: aarti.name, text });
    } else {
      await handleCopy();
    }
  };

  const handleTTS = () => {
    if (isPlaying || isPaused) {
      stopNarration();
    } else {
      startNarration(textToDisplay);
    }
  };

  if (!aarti) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8E7' }}>
        <div className="text-center">
          <div className="text-4xl mb-3">🪔</div>
          <p className="font-devanagari text-lg" style={{ color: '#8B3A00' }}>
            आरती नहीं मिली
          </p>
          <button
            onClick={() => navigate({ to: '/aarti' })}
            className="mt-4 px-4 py-2 rounded-full text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #FFD700)' }}
          >
            वापस जाएँ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFF8E7 0%, #FFF3D4 100%)' }}>

      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, #FF6B00, #FFD700)',
          boxShadow: '0 2px 10px rgba(255,107,0,0.3)',
        }}
      >
        <button
          onClick={() => navigate({ to: '/aarti' })}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.25)' }}
        >
          <ChevronLeft size={18} color="white" />
        </button>
        <div className="flex-1 min-w-0">
          <h1
            className="font-devanagari text-white font-bold text-base truncate"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            {aarti.name}
          </h1>
        </div>
        <span className="text-xl animate-flame-flicker">🪔</span>
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
            className="px-3 py-1.5 text-xs font-medium font-devanagari transition-all"
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

        {/* TTS Button */}
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

      {/* Aarti Text */}
      <div className="px-4 pb-6">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF3D4 100%)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 20px rgba(255,215,0,0.2)',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 text-lg opacity-30" style={{ color: '#FFD700' }}>✦</div>
          <div className="absolute top-2 right-2 text-lg opacity-30" style={{ color: '#FFD700' }}>✦</div>

          {/* Diya watermark */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url(/assets/generated/diya-glow.dim_256x256.png)',
              backgroundSize: '150px',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <p
            className="relative z-10 font-devanagari text-base leading-loose whitespace-pre-line"
            style={{ color: '#5D2E0C' }}
          >
            {textToDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}
