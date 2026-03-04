import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, LogOut } from "lucide-react";
import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleAuth}
      disabled={isLoggingIn}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 disabled:opacity-60
        ${
          isAuthenticated
            ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
            : "bg-white text-amber-700 hover:bg-amber-50 shadow-sm"
        }
      `}
      title={
        isAuthenticated
          ? "Logout"
          : "Login with Internet Identity (Google/Passkey)"
      }
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="hidden sm:inline">Login...</span>
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </>
      ) : (
        <>
          <LogIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Login</span>
        </>
      )}
    </button>
  );
}
