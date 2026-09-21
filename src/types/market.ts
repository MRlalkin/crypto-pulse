export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number | null;
  total_volume?: number;
  high_24h?: number;
  low_24h?: number;
  price_change_24h?: number;
  price_change_percentage_24h: number;
  circulating_supply?: number;
  total_supply?: number | null;
  max_supply?: number | null;
  ath?: number;
  last_updated?: string;
}

export type FilterSortType = 'market_cap' | 'gainers' | 'losers';

export interface FilterSort {
  type: FilterSortType;
  searchQuery: string;
}

// Telegram WebApp Type definitions
export interface TelegramHapticFeedback {
  impactOccurred: (
    style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
  ) => TelegramHapticFeedback;
  notificationOccurred: (
    type: 'error' | 'success' | 'warning'
  ) => TelegramHapticFeedback;
  selectionChanged: () => TelegramHapticFeedback;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramWebApp {
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
  HapticFeedback?: TelegramHapticFeedback;
  colorScheme?: 'light' | 'dark';
  themeParams?: Record<string, string>;
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramUser;
    [key: string]: unknown;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
