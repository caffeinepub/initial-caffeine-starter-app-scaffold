import React, { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';

interface Shloka {
  id: number | bigint;
  sanskrit: string;
  hindiMeaning: string;
  englishMeaning: string;
}

interface ShlokaCardProps {
  shloka: Shloka;
}

export default function ShlokaCard({ shloka }: ShlokaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${shloka.sanskrit}\n\nहिंदी अर्थ: ${shloka.hindiMeaning}\n\nEnglish: ${shloka.englishMeaning}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `${shloka.sanskrit}\n\nहिंदी अर्थ: ${shloka.hindiMeaning}\n\nEnglish: ${shloka.englishMeaning}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await handleCopy();
    }
  };

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF3D4 100%)',
        border: '3px solid #FFD700',
        boxShadow: '0 4px 20px rgba(255,215,0,0.3)',
      }}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 opacity-30"
        style={{ borderTop: '3px solid #FF6B00', borderLeft: '3px solid #FF6B00', borderRadius: '0 0 8px 0' }} />
      <div className="absolute top-0 right-0 w-8 h-8 opacity-30"
        style={{ borderTop: '3px solid #FF6B00', borderRight: '3px solid #FF6B00', borderRadius: '0 0 0 8px' }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 opacity-30"
        style={{ borderBottom: '3px solid #FF6B00', borderLeft: '3px solid #FF6B00', borderRadius: '0 8px 0 0' }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 opacity-30"
        style={{ borderBottom: '3px solid #FF6B00', borderRight: '3px solid #FF6B00', borderRadius: '8px 0 0 0' }} />

      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span style={{ color: '#FFD700' }}>✦</span>
        <span className="font-devanagari text-sm font-bold" style={{ color: '#FF6B00' }}>
          श्लोक
        </span>
        <span style={{ color: '#FFD700' }}>✦</span>
      </div>

      {/* Sanskrit Text */}
      <p
        className="font-devanagari text-base font-bold text-center leading-relaxed mb-4"
        style={{ color: '#FF6B00' }}
      >
        {shloka.sanskrit}
      </p>

      {/* Divider */}
      <div className="flex items-center gap-2 my-3">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #FFD700)' }} />
        <span className="text-xs" style={{ color: '#FFD700' }}>🌸</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
      </div>

      {/* Hindi Meaning */}
      <p
        className="font-devanagari text-sm leading-relaxed mb-2 text-center"
        style={{ color: '#8B3A00' }}
      >
        {shloka.hindiMeaning}
      </p>

      {/* English Meaning */}
      <p
        className="font-poppins text-xs italic text-center mb-4"
        style={{ color: '#A0522D' }}
      >
        {shloka.englishMeaning}
      </p>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95"
          style={{
            background: copied ? 'linear-gradient(135deg, #FF6B00, #FFD700)' : 'rgba(255,107,0,0.1)',
            color: copied ? 'white' : '#FF6B00',
            border: '1px solid #FF6B00',
          }}
        >
          <Copy size={12} />
          {copied ? 'कॉपी हो गया!' : 'कॉपी करें'}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95"
          style={{
            background: 'rgba(255,215,0,0.15)',
            color: '#8B6914',
            border: '1px solid #FFD700',
          }}
        >
          <Share2 size={12} />
          शेयर करें
        </button>
      </div>
    </div>
  );
}
