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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 shadow-2xl"
      style={{
        background:
          "linear-gradient(180deg, rgba(15,7,33,0.97) 0%, rgba(10,5,25,0.99) 100%)",
        borderTop: "1px solid rgba(255,153,51,0.2)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-around px-0.5 py-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 px-0.5 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1 hover:scale-110 active:scale-95"
              >
                <span
                  className="text-base leading-none"
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 0 6px rgba(255,153,51,0.8))"
                      : "none",
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    display: "block",
                    transition: "all 0.2s",
                  }}
                >
                  {item.emoji}
                </span>
                <span
                  className="text-[8px] font-medium leading-none truncate w-full text-center"
                  style={{
                    color: isActive ? "#ffd700" : "rgba(255,255,255,0.45)",
                  }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span
                    className="w-4 h-0.5 rounded-full mt-0.5"
                    style={{
                      background: "linear-gradient(90deg, #ff9933, #ffd700)",
                      boxShadow: "0 0 6px rgba(255,153,51,0.6)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
