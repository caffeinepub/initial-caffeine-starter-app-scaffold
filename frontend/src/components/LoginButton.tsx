import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={isLoggingIn}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50"
      style={{
        background: isAuthenticated
          ? 'rgba(255,255,255,0.25)'
          : 'rgba(255,255,255,0.2)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.5)',
      }}
    >
      {isLoggingIn ? '...' : isAuthenticated ? 'लॉगआउट' : 'लॉगिन'}
    </button>
  );
}
