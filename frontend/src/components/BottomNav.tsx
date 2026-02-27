import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Calendar, BookOpen, MapPin, User, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'होम', path: '/' },
  { icon: Calendar, label: 'पंचांग', path: '/panchang' },
  { icon: () => <span className="text-lg">📿</span>, label: 'जप', path: '/jap' },
  { icon: () => <span className="text-lg">🪔</span>, label: 'आरती', path: '/aarti' },
  { icon: BookOpen, label: 'कथाएँ', path: '/kathayen' },
  { icon: MapPin, label: 'मंदिर', path: '/mandir' },
  { icon: Sparkles, label: 'AI गुरु', path: '/ai-guru' },
  { icon: User, label: 'प्रोफ़ाइल', path: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 px-1 py-2"
      style={{
        background: 'linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.42 0.15 28))',
        borderTop: '1px solid oklch(0.82 0.18 80 / 0.3)',
        boxShadow: '0 -4px 20px oklch(0.35 0.14 20 / 0.5)',
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(item => {
          const isActive = currentPath === item.path;
          const IconComponent = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className="flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? 'oklch(0.82 0.18 80 / 0.15)' : 'transparent',
                border: isActive ? '1px solid oklch(0.82 0.18 80 / 0.3)' : '1px solid transparent',
                minWidth: '38px',
              }}
            >
              <div
                style={{
                  color: isActive ? '#FFD700' : 'oklch(0.82 0.18 80 / 0.5)',
                  filter: isActive ? 'drop-shadow(0 0 6px oklch(0.82 0.18 80 / 0.6))' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <IconComponent size={18} />
              </div>
              <span
                className="text-xs"
                style={{
                  color: isActive ? '#FFD700' : 'oklch(0.82 0.18 80 / 0.5)',
                  fontSize: '0.55rem',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
