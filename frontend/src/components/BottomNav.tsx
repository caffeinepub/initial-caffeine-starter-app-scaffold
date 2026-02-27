import React from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

const navItems = [
  { path: '/', label: 'होम', emoji: '🏠' },
  { path: '/panchang', label: 'पंचांग', emoji: '📅' },
  { path: '/jap', label: 'जप', emoji: '📿' },
  { path: '/aarti', label: 'आरती', emoji: '🪔' },
  { path: '/kathayen', label: 'कथाएँ', emoji: '📖' },
  { path: '/mandir', label: 'मंदिर', emoji: '🛕' },
  { path: '/ai-guru', label: 'AI गुरु', emoji: '🤖' },
  { path: '/profile', label: 'प्रोफ़ाइल', emoji: '👤' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
      style={{
        background: 'linear-gradient(180deg, #FFF8E7 0%, #FFF3D4 100%)',
        borderTop: '2px solid #FFD700',
        boxShadow: '0 -4px 20px rgba(255, 107, 0, 0.15)',
      }}
    >
      {/* Decorative top line */}
      <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #C0392B, #FF6B00, #FFD700, #FF6B00, #C0392B)' }} />
      
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className="flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(255,215,0,0.2))'
                  : 'transparent',
                border: isActive ? '1px solid rgba(255,107,0,0.3)' : '1px solid transparent',
              }}
            >
              <span
                className="text-base leading-none"
                style={{
                  filter: isActive ? 'drop-shadow(0 0 4px rgba(255,107,0,0.6))' : 'none',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.emoji}
              </span>
              <span
                className="text-[9px] font-medium leading-none font-devanagari truncate w-full text-center"
                style={{
                  color: isActive ? '#FF6B00' : '#8B5E3C',
                  fontWeight: isActive ? '700' : '500',
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: '#FFD700', boxShadow: '0 0 4px #FFD700' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
