import React from 'react';
import { useNavigate } from '@tanstack/react-router';

interface AartiData {
  id: string | number;
  name: string;
  hindiText: string;
  englishText?: string;
  deity?: string;
}

interface AartiCardProps {
  aarti: AartiData;
}

export default function AartiCard({ aarti }: AartiCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate({ to: '/aarti/$id', params: { id: String(aarti.id) } })}
      className="w-full text-left rounded-2xl p-4 transition-all duration-200 active:scale-95 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF3D4 100%)',
        border: '2px solid #FFD700',
        boxShadow: '0 4px 15px rgba(255,215,0,0.2)',
      }}
    >
      {/* Decorative corner */}
      <div
        className="absolute top-0 right-0 w-12 h-12 opacity-20"
        style={{
          background: 'linear-gradient(225deg, #FF6B00, transparent)',
          borderRadius: '0 0 0 100%',
        }}
      />

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 animate-flame-flicker"
          style={{
            background: 'linear-gradient(135deg, #FF6B00, #FFD700)',
            boxShadow: '0 2px 10px rgba(255,107,0,0.4)',
          }}
        >
          🪔
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-devanagari font-bold text-base leading-tight mb-1"
            style={{ color: '#8B3A00' }}
          >
            {aarti.name}
          </h3>
          <p
            className="font-devanagari text-xs leading-relaxed line-clamp-2"
            style={{ color: '#A0522D' }}
          >
            {aarti.hindiText.substring(0, 100)}...
          </p>
          {aarti.deity && (
            <span
              className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(255,107,0,0.1)',
                color: '#FF6B00',
                border: '1px solid rgba(255,107,0,0.3)',
              }}
            >
              {aarti.deity}
            </span>
          )}
        </div>

        {/* Arrow */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #FFD700)', color: 'white' }}
        >
          ›
        </div>
      </div>
    </button>
  );
}
