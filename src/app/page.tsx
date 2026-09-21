'use client';

import React, { useState, useEffect } from 'react';
import { MarketPulse } from '@/components/MarketPulse';
import { WalletInspector } from '@/components/WalletInspector';
import { ProfileScreen } from '@/components/ProfileScreen';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { Terminal } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('market');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Notify Telegram WebApp that the app is ready
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready?.();
      window.Telegram.WebApp.expand?.();
    }

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().slice(11, 19) + ' UTC'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#060807] text-zinc-100 flex flex-col justify-between font-mono relative overflow-hidden">
      {/* Background cyber grid effect */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Terminal Bar */}
      <div className="w-full border-b border-emerald-950 bg-black/70 backdrop-blur-md px-4 py-2 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="font-bold text-emerald-400 tracking-wider">
              PULSE_OS::TERMINAL
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-500">
              SYS.TIME: <span className="text-zinc-300">{currentTime || '12:00:00 UTC'}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800/60 text-emerald-400 text-[10px]">
              NODE: ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Main Tab Screen Content */}
      <div className="flex-1 w-full max-w-2xl mx-auto z-10">
        {activeTab === 'market' && <MarketPulse />}

        {/* Wallet Screen Tab */}
        {activeTab === 'wallet' && <WalletInspector />}

        {/* Profile Screen Tab */}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Persistent Bottom Navigation with Telegram Haptic Feedback */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
