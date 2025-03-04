"use client";

import { useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { useAuthStore } from '@/store/authStore';
import { SessionTimeout } from '@/components/auth/session-timeout';

export function Providers({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <SessionTimeout />
    </ThemeProvider>
  );
}