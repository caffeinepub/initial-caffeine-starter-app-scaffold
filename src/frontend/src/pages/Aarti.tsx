import { Link } from "@tanstack/react-router";
import React from "react";
import { AARTIS } from "../lib/staticData";

export default function Aarti() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-b from-yellow-900 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">🪔 आरती संग्रह</h1>
        <p className="text-amber-200 text-sm">पवित्र आरतियां — हिंदी में</p>
      </div>

      {/* Aarti Grid */}
      <div className="px-4 py-4 grid grid-cols-1 gap-4">
        {AARTIS && AARTIS.length > 0 ? (
          AARTIS.map((aarti) => (
            <Link
              key={aarti.id}
              to="/aarti/$id"
              params={{ id: String(aarti.id) }}
              className="block"
            >
              <div className="bg-card border border-border rounded-2xl p-4 hover:border-amber-500/50 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-amber-500 flex items-center justify-center text-2xl flex-shrink-0">
                    {aarti.emoji || "🪔"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-bold text-base">
                      {aarti.name}
                    </h3>
                    {aarti.deity && (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {aarti.deity}
                      </span>
                    )}
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                      {aarti.hindiText
                        ? `${aarti.hindiText.substring(0, 80)}...`
                        : ""}
                    </p>
                  </div>
                  <span className="text-amber-500 text-xl font-bold flex-shrink-0">
                    ›
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🪔</div>
            <h3 className="text-foreground font-bold text-lg mb-2">
              कोई आरती उपलब्ध नहीं है
            </h3>
            <p className="text-muted-foreground text-sm">
              अभी कोई आरती नहीं मिली। कृपया बाद में पुनः प्रयास करें।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
