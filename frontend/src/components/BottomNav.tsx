import { Link, useLocation } from '@tanstack/react-router';
import { Home, Calendar, Circle, Building2, User, Sparkles, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/panchang', label: 'Panchang', icon: Calendar },
  { path: '/jap', label: 'Jap', icon: Circle },
  { path: '/kathayen', label: 'Kathayen', icon: BookOpen },
  { path: '/mandir', label: 'Mandir', icon: Building2 },
  { path: '/ai-guru', label: 'AI Guru', icon: Sparkles },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t-2 border-saffron/20 bottom-nav-safe shadow-lg">
      <div className="flex items-center justify-around py-1 px-0.5">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-xl transition-all duration-200 min-w-[40px] ${
                active
                  ? 'text-saffron bg-saffron/10'
                  : 'text-muted-foreground hover:text-saffron hover:bg-saffron/5'
              }`}
            >
              {path === '/jap' ? (
                <span className={`text-xl leading-none ${active ? 'text-saffron' : ''}`}>📿</span>
              ) : path === '/ai-guru' ? (
                <span className={`relative flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${active ? 'text-saffron' : ''}`} />
                  {active && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  )}
                </span>
              ) : (
                <Icon className={`h-5 w-5 ${active ? 'text-saffron' : ''}`} />
              )}
              <span className={`text-[8px] font-medium font-body ${active ? 'text-saffron font-semibold' : ''}`}>
                {label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-saffron mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
