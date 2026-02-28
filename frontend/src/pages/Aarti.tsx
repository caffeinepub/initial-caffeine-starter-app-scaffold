import { Link } from '@tanstack/react-router';
import { AARTIS } from '../lib/staticData';

export default function Aarti() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-b from-yellow-900 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">🪔 आरती संग्रह</h1>
        <p className="text-amber-200 text-sm">पवित्र आरतियां — हिंदी और अंग्रेजी में</p>
      </div>

      <div className="px-4 py-4 grid grid-cols-1 gap-4">
        {AARTIS.map((aarti) => (
          <Link
            key={aarti.id}
            to="/aarti/$id"
            params={{ id: String(aarti.id) }}
            className="block"
          >
            <div className="bg-card border border-border rounded-2xl p-4 hover:border-gold-500/50 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-amber-500 flex items-center justify-center text-2xl flex-shrink-0">
                  {aarti.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-bold text-base">{aarti.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                    {aarti.hindiText.substring(0, 80)}...
                  </p>
                </div>
                <span className="text-gold-400 text-lg">›</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
