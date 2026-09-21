'use client';

import { useState, useEffect, useCallback } from 'react';
import { TelegramUser, TelegramWebApp } from '@/types/market';

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isTelegram, setIsTelegram] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const app = window.Telegram.WebApp;
      setWebApp(app);

      if (app.initDataUnsafe?.user) {
        setUser(app.initDataUnsafe.user);
        setIsTelegram(true);
      } else if (app.initData && app.initData.length > 0) {
        setIsTelegram(true);
      }
    }
  }, []);

  const triggerHaptic = useCallback(
    (style: 'light' | 'medium' | 'heavy' = 'light') => {
      try {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
        } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(style === 'medium' ? 25 : 15);
        }
      } catch {
        // Haptic feedback not supported
      }
    },
    []
  );

  const openTelegramLink = useCallback(
    (url: string) => {
      triggerHaptic('light');
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
      } else if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    [triggerHaptic]
  );

  return {
    webApp,
    user,
    isTelegram,
    triggerHaptic,
    openTelegramLink,
  };
}
