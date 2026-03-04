import { Loader2, LogOut, RotateCcw, Shield, Star, User } from "lucide-react";
import React, { useState } from "react";
import VratModeDashboard from "../components/VratModeDashboard";
import VratModeToggle from "../components/VratModeToggle";
import { useAuth } from "../hooks/useAuth";
import { useGetJapStats, useResetJapStats } from "../hooks/useQueries";

export default function Profile() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const [vratMode, setVratMode] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  const { data: japStats } = useGetJapStats();
  const resetJap = useResetJapStats();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 pb-24">
        <div className="text-6xl">🕉️</div>
        <h2 className="text-xl font-bold text-foreground">प्रोफाइल</h2>
        <p className="text-muted-foreground text-center text-sm">
          अपनी प्रोफाइल देखने के लिए login करें।
        </p>
        <button
          type="button"
          onClick={() => setShowLoginHint(true)}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium"
        >
          Login करें
        </button>
        {showLoginHint && (
          <p className="text-xs text-muted-foreground text-center">
            Header में Login बटन दबाएँ।
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary to-accent px-4 pt-8 pb-10">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center text-4xl border-2 border-primary-foreground/40">
              {isAdmin ? "👑" : "🕉️"}
            </div>
            {isAdmin && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Shield size={12} className="text-yellow-900" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary-foreground">
              {user?.username}
            </h2>
            {isAdmin && (
              <div className="flex items-center justify-center gap-1.5 mt-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-3 py-1">
                <Shield size={12} className="text-yellow-300" />
                <span className="text-yellow-300 text-xs font-bold">ADMIN</span>
                <Star size={10} className="text-yellow-300" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-5">
        {/* Stats Card */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-foreground text-sm mb-3">
            🙏 जप आँकड़े
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {japStats?.daily?.toString() ?? "0"}
              </p>
              <p className="text-xs text-muted-foreground">आज</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {japStats?.lifetime?.toString() ?? "0"}
              </p>
              <p className="text-xs text-muted-foreground">कुल</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {japStats?.streak?.toString() ?? "0"}
              </p>
              <p className="text-xs text-muted-foreground">streak</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => resetJap.mutate()}
            disabled={resetJap.isPending}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-medium transition-colors disabled:opacity-50"
          >
            {resetJap.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RotateCcw size={12} />
            )}
            जप रीसेट करें
          </button>
        </div>

        {/* Vrat Mode */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm">
          <VratModeToggle enabled={vratMode} onToggle={setVratMode} />
        </div>

        {vratMode && (
          <div className="mb-4">
            <VratModeDashboard />
          </div>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield
                size={16}
                className="text-yellow-600 dark:text-yellow-400"
              />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">
                Admin Controls
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/admin";
              }}
              className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Admin Panel खोलें
            </button>
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-2xl text-foreground hover:bg-muted transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
