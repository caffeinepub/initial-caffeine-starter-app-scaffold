import { Outlet } from "@tanstack/react-router";
import { LogIn, LogOut, Shield } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDailyNotifications } from "../hooks/useDailyNotifications";
import AuthModal from "./AuthModal";
import BottomNav from "./BottomNav";
import EkadashiReminderBanner from "./EkadashiReminderBanner";
import NotificationBanner from "./NotificationBanner";

export default function AppLayout() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentBanner, dismissBanner } = useDailyNotifications();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-40 shadow-lg"
        style={{
          background:
            "linear-gradient(90deg, #1a0533 0%, #2d0a4e 50%, #1a0533 100%)",
          borderBottom: "1px solid rgba(255,153,51,0.25)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/om-logo.dim_128x128.png"
              alt="Om"
              className="w-8 h-8 object-contain"
              style={{ filter: "drop-shadow(0 0 6px rgba(255,153,51,0.6))" }}
            />
            <div>
              <h1 className="font-bold text-base leading-tight text-white">
                सनातन प्रो
              </h1>
              <p
                className="text-xs leading-tight"
                style={{ color: "rgba(255,215,0,0.7)" }}
              >
                जय श्री राम 🙏
              </p>
            </div>
          </div>

          {/* Auth Button */}
          <div className="flex items-center gap-2">
            {isAuthenticated && isAdmin && (
              <div
                className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{
                  background: "rgba(255,215,0,0.15)",
                  border: "1px solid rgba(255,215,0,0.4)",
                }}
              >
                <Shield size={10} style={{ color: "#ffd700" }} />
                <span
                  className="text-xs font-bold"
                  style={{ color: "#ffd700" }}
                >
                  ADMIN
                </span>
              </div>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: "rgba(255,153,51,0.15)",
                  color: "#ffd700",
                  border: "1px solid rgba(255,153,51,0.3)",
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: "rgba(255,153,51,0.2)",
                  color: "#ffd700",
                  border: "1px solid rgba(255,153,51,0.4)",
                }}
              >
                <LogIn size={14} />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notification Banners */}
      {currentBanner && (
        <NotificationBanner message={currentBanner} onDismiss={dismissBanner} />
      )}
      <EkadashiReminderBanner />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
