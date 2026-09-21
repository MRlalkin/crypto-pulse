'use client';

import React, { useState, useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import {
  Terminal,
  User,
  Shield,
  Radio,
  ExternalLink,
  Info,
  Send,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Globe,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, isTelegram, triggerHaptic, openTelegramLink } = useTelegram();
  const [imgError, setImgError] = useState(false);
  const [latency, setLatency] = useState('24ms');

  // Realistic terminal ping simulation
  useEffect(() => {
    const pings = ['18ms', '22ms', '24ms', '19ms', '26ms'];
    const interval = setInterval(() => {
      const randomPing = pings[Math.floor(Math.random() * pings.length)];
      setLatency(randomPing);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCommunityClick = () => {
    triggerHaptic('light');
    openTelegramLink('https://t.me/cryptopulse_community');
  };

  const displayName = user?.first_name
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
    : 'ANONYMOUS_OPERATOR';

  const displayUsername = user?.username ? `@${user.username}` : '@guest_terminal';
  const displayId = user?.id ? `#${user.id}` : '#DEV_NODE_01';

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-4 pb-28 font-mono text-zinc-100 select-none">
      {/* Terminal System Header */}
      <header className="mb-4 p-3 bg-[#0B0E14] border border-emerald-500/40 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 tracking-wider">
              SYS.PROFILE // OPERATOR_DATA
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {isTelegram ? 'TG_INTEGRATED' : 'WEB_MODE'}
          </span>
        </div>

        <div className="text-[11px] text-zinc-400 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-2">
          <span className="text-zinc-500">
            SECURITY: <span className="text-emerald-400">ENCRYPTED_SESSION</span>
          </span>
          <span className="text-zinc-500">
            SESSION_ID: <span className="text-zinc-300">PULSE-8921-X</span>
          </span>
        </div>
      </header>

      {/* Web Mode Banner if not in Telegram */}
      {!isTelegram && (
        <div className="mb-4 p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-xs text-amber-300">
          <Globe className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-amber-400">
              Веб-режим: Telegram данные недоступны
            </div>
            <div className="text-[11px] text-zinc-400">
              Приложение открыто в браузере. Для синхронизации профиля запустите Crypto Pulse через Telegram Mini App.
            </div>
          </div>
        </div>
      )}

      {/* User Identity Card */}
      <div className="mb-4 p-4 sm:p-5 bg-[#1E293B]/80 border border-emerald-500/40 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.08)] relative overflow-hidden">
        <div className="flex items-center gap-4">
          {/* Avatar with cyber neon border */}
          <div className="relative w-14 h-14 rounded-lg bg-[#0B0E14] border-2 border-emerald-500/60 p-0.5 flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)] flex items-center justify-center overflow-hidden">
            {user?.photo_url && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photo_url}
                alt={displayName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-950/40 text-emerald-400">
                <span className="text-lg font-bold">&gt;_</span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black shadow-[0_0_6px_#34d399]" />
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-100 truncate">
                {displayName}
              </h2>
              {isTelegram && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
            </div>
            <div className="text-xs text-emerald-400/90 font-mono mt-0.5">
              {displayUsername}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1 flex items-center gap-2">
              <span>{displayId}</span>
              <span>•</span>
              <span className="text-zinc-400 uppercase">
                {user?.language_code ? `LANG: ${user.language_code}` : 'TIER: OPERATOR'}
              </span>
            </div>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-[#0B0E14]/80 border border-slate-800 rounded">
            <div className="text-[10px] text-zinc-500">ДОСТУП К ТЕРМИНАЛУ:</div>
            <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <Shield className="w-3 h-3" /> FULL_ACCESS
            </div>
          </div>
          <div className="p-2 bg-[#0B0E14]/80 border border-slate-800 rounded">
            <div className="text-[10px] text-zinc-500">HAPTIC ОТКЛИК:</div>
            <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ACTIVE_V2
            </div>
          </div>
        </div>
      </div>

      {/* Network Status Block */}
      <div className="mb-4 p-4 bg-[#1E293B]/70 border border-slate-800 hover:border-emerald-500/40 rounded-lg transition-all space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-300 font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>СТАТУС СЕТИ // BLOCKCHAIN_NODE</span>
          </div>
          <span className="px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            ONLINE
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-zinc-500">PRIMARY_CHAIN:</span>
            <span className="font-bold text-zinc-200">Ethereum Mainnet (Chain ID: 1)</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-zinc-500">RPC_PROVIDER:</span>
            <span className="font-mono text-emerald-400 text-[11px]">
              ethereum-rpc.publicnode.com
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-zinc-500">ЗАДЕРЖКА / RPC:</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">{latency}</span>
              <span className="text-[10px] text-zinc-400 bg-slate-800 px-1 rounded">
                Active
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-500">COINGECKO_FEED:</span>
            <span className="text-zinc-300 font-mono text-[11px]">
              TTL 30s // AUTO_SYNC
            </span>
          </div>
        </div>
      </div>

      {/* About Service & Community Block */}
      <div className="mb-4 p-4 bg-[#1E293B]/70 border border-slate-800 rounded-lg space-y-3">
        <div className="flex items-center gap-2 text-xs text-zinc-300 font-bold">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>О СЕРВИСЕ & КОМЬЮНИТИ</span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          <strong className="text-zinc-200">Crypto Pulse</strong> — высокоскоростной терминал мониторинга криптовалютного рынка и ончейн-аудита кошельков для экосистемы Telegram. Обеспечивает мгновенный доступ к топ-20 котировкам, динамике курсов и анализу транзакций в реальном времени.
        </p>

        {/* Telegram Community Button with Neon Glow */}
        <button
          onClick={handleCommunityClick}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-[#0B0E14] hover:bg-emerald-950/60 border-2 border-emerald-500 hover:border-emerald-400 text-emerald-300 font-bold text-xs rounded-lg transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(16,185,129,0.35)] group"
        >
          <Send className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          <span>ПРИСОЕДИНИТЬСЯ К TELEGRAM КОМЬЮНИТИ</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400 ml-0.5 opacity-80" />
        </button>
      </div>

      {/* System Version & Meta Footer */}
      <footer className="pt-2 text-center text-xs space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E293B]/60 border border-slate-800 rounded-full text-zinc-400 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>ВЕРСИЯ: <strong className="text-emerald-400">v1.0.0 (MVP)</strong></span>
          <span>•</span>
          <span className="text-zinc-500">BUILD 2026.09</span>
        </div>

        <div className="text-[10px] text-zinc-600 font-mono">
          &gt;&gt; CRYPTO_PULSE_OS // ZERO_TELEMETRY // SECURE_RUNTIME &lt;&lt;
        </div>
      </footer>
    </section>
  );
};
