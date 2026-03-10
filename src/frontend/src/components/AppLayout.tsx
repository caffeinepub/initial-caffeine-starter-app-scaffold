import { Outlet } from "@tanstack/react-router";
import { Bell, LogIn, LogOut, Shield, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDailyNotifications } from "../hooks/useDailyNotifications";
import {
  type AppNotification,
  checkKathaCountChange,
  checkPostCountChange,
  formatTimeAgoNotification,
  getNotifications,
  getUnreadCount,
  markAllRead,
} from "../hooks/useNotifications";
import {
  useGetAllKathayen,
  useGetApprovedCommunityPosts,
} from "../hooks/useQueries";
import AuthModal from "./AuthModal";
import BottomNav from "./BottomNav";
import EkadashiReminderBanner from "./EkadashiReminderBanner";
import NotificationBanner from "./NotificationBanner";

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  if (type === "katha") return <span>🕉️</span>;
  if (type === "community") return <span>👥</span>;
  return <span>📢</span>;
}

export default function AppLayout() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentBanner, dismissBanner } = useDailyNotifications();

  // Notification bell state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = useRef<HTMLDivElement>(null);

  // Fetch kathayen and posts to detect new content
  const { data: kathayen } = useGetAllKathayen();
  const { data: communityPosts } = useGetApprovedCommunityPosts();

  // Check for new content and update notifications
  useEffect(() => {
    if (kathayen !== undefined) {
      checkKathaCountChange(kathayen.length);
    }
  }, [kathayen]);

  useEffect(() => {
    if (communityPosts !== undefined) {
      checkPostCountChange(communityPosts.length);
    }
  }, [communityPosts]);

  // Refresh notifications list periodically
  useEffect(() => {
    const refresh = () => {
      setNotifications(getNotifications().slice(0, 10));
      setUnreadCount(getUnreadCount());
    };
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showNotifications]);

  const handleOpenNotifications = () => {
    setShowNotifications((v) => !v);
    if (!showNotifications) {
      // Mark all read after a short delay
      setTimeout(() => {
        markAllRead();
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }, 1500);
    }
  };

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

          {/* Right side — Bell + Auth */}
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

            {/* Bell Icon — Notification */}
            <div ref={bellRef} className="relative">
              <button
                type="button"
                data-ocid="app.notification.button"
                onClick={handleOpenNotifications}
                className="relative flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                style={{
                  background: "rgba(255,153,51,0.12)",
                  border: "1px solid rgba(255,153,51,0.25)",
                  color: "#ffd700",
                }}
                aria-label="सूचनाएं"
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white font-bold"
                    style={{
                      fontSize: "10px",
                      background: "#ef4444",
                      padding: "0 3px",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div
                  data-ocid="app.notification.popover"
                  className="absolute right-0 top-10 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a0533 0%, #2d0a4e 100%)",
                    border: "1px solid rgba(255,153,51,0.3)",
                    maxHeight: "70vh",
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: "1px solid rgba(255,153,51,0.2)" }}
                  >
                    <h3
                      className="text-sm font-bold"
                      style={{ color: "#ffd700" }}
                    >
                      🔔 सूचनाएं
                    </h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          data-ocid="app.notification.mark_read.button"
                          onClick={() => {
                            markAllRead();
                            setUnreadCount(0);
                            setNotifications((prev) =>
                              prev.map((n) => ({ ...n, read: true })),
                            );
                          }}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(255,153,51,0.2)",
                            color: "#ffd700",
                            border: "1px solid rgba(255,153,51,0.3)",
                          }}
                        >
                          सभी पढ़ें
                        </button>
                      )}
                      <button
                        type="button"
                        data-ocid="app.notification.close_button"
                        onClick={() => setShowNotifications(false)}
                        style={{ color: "rgba(255,215,0,0.6)" }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "calc(70vh - 60px)" }}
                  >
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-3xl mb-2">🔔</div>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(255,215,0,0.6)" }}
                        >
                          कोई नई सूचना नहीं है
                        </p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className="flex items-start gap-3 px-4 py-3 transition-colors"
                            style={{
                              borderBottom: "1px solid rgba(255,153,51,0.1)",
                              background: n.read
                                ? "transparent"
                                : "rgba(255,153,51,0.06)",
                            }}
                          >
                            <span className="text-base mt-0.5 flex-shrink-0">
                              <NotificationIcon type={n.type} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm leading-snug"
                                style={{
                                  color: n.read
                                    ? "rgba(255,215,0,0.7)"
                                    : "#ffd700",
                                  fontWeight: n.read ? 400 : 600,
                                }}
                              >
                                {n.message}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: "rgba(255,153,51,0.6)" }}
                              >
                                {formatTimeAgoNotification(n.timestamp)}
                              </p>
                            </div>
                            {!n.read && (
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                                style={{ background: "#ff9933" }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
