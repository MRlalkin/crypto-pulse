'use client';

import React from 'react';
import { Activity, Wallet, User } from 'lucide-react';

export type NavTab = 'market' | 'wallet' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch (e) {
      // Haptic not available or supported in current environment
    }
  };

  const handleTabClick = (tab: NavTab) => {
    if (activeTab !== tab) {
      triggerHaptic('light');
      onTabChange(tab);
    }
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; code: string }[] = [
    {
      id: 'market',
      label: 'Рынок',
      code: 'SYS.MKT',
      icon: <Activity className="w-5 h-5 transition-transform group-hover:scale-110" />,
    },
    {
      id: 'wallet',
      label: 'Кошелек',
      code: 'SYS.WLT',
      icon: <Wallet className="w-5 h-5 transition-transform group-hover:scale-110" />,
    },
    {
      id: 'profile',
      label: 'Профиль',
      code: 'SYS.USR',
      icon: <User className="w-5 h-5 transition-transform group-hover:scale-110" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-emerald-500/30 select-none pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {/* Terminal decorative top edge line with phosphor glow */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.8)]" />

      <div className="max-w-md mx-auto px-4 pt-2 flex items-center justify-around font-mono">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`group flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded transition-all duration-150 relative ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {/* Active neon highlight box */}
              {isActive && (
                <div className="absolute inset-0 bg-emerald-950/40 border border-emerald-500/40 rounded shadow-[inset_0_0_12px_rgba(16,185,129,0.15)] pointer-events-none" />
              )}

              {/* Status indicator pip */}
              <div className="flex items-center gap-1.5 relative z-10">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                      : 'bg-zinc-700'
                  }`}
                />
                {item.icon}
              </div>

              {/* Tab Title */}
              <span className="text-[11px] font-bold tracking-wider uppercase mt-1 relative z-10 flex items-center gap-1">
                {isActive && <span className="text-emerald-500 text-[9px]">&gt;</span>}
                {item.label}
              </span>

              {/* Sub-system code (retro terminal touch) */}
              <span className="text-[8px] text-zinc-600 tracking-tighter uppercase relative z-10">
                {item.code}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
