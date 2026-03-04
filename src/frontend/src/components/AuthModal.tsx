import { Lock, LogIn, User, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(username.trim(), password);
      if (success) {
        onSuccess?.();
        onClose();
        setUsername("");
        setPassword("");
      } else {
        setError("गलत username या password। कृपया पुनः प्रयास करें।");
      }
    } catch {
      setError("Login में समस्या आई। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent px-6 py-5 text-center">
          <div className="text-4xl mb-2">🕉️</div>
          <h2 className="text-xl font-bold text-primary-foreground">
            जय श्री राम
          </h2>
          <p className="text-primary-foreground/80 text-sm mt-1">
            अपने खाते में प्रवेश करें
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="auth-username"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Username
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="अपना username डालें"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="अपना password डालें"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <LogIn size={16} />
            )}
            {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            नए उपयोगकर्ता: कोई भी username (3+ अक्षर) और password (4+ अक्षर) से
            login करें
          </p>
        </form>
      </div>
    </div>
  );
}
