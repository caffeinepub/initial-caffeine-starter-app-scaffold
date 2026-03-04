import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { path: "/", label: "होम", emoji: "🏠" },
  { path: "/panchang", label: "पंचांग", emoji: "📅" },
  { path: "/jap", label: "जाप", emoji: "📿" },
  { path: "/aarti", label: "आरती", emoji: "🪔" },
  { path: "/kathayen", label: "कथाएं", emoji: "📖" },
  { path: "/mandir", label: "मंदिर", emoji: "🛕" },
  { path: "/ai-guru", label: "AI गुरु", emoji: "🔮" },
  { path: "/community", label: "समाज", emoji: "🤝" },
  { path: "/profile", label: "प्रोफाइल", emoji: "👤" },
];

export default function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-around px-0.5 py-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-0.5 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1 hover:scale-110 ${
                  isActive
                    ? "text-gold-500 nav-active-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`text-base leading-none ${isActive ? "animate-bounce-subtle" : ""}`}
                >
                  {item.emoji}
                </span>
                <span
                  className={`text-[8px] font-medium leading-none truncate w-full text-center ${isActive ? "text-gold-500" : ""}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-gold-500 mt-0.5 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
