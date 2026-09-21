'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { RefreshCw, Search, TrendingUp, TrendingDown, Layers, Terminal, AlertCircle } from 'lucide-react';
import { Coin, FilterSortType } from '@/types/market';

const fetcher = async (url: string): Promise<Coin[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch market pulse`);
  }
  return res.json();
};

export const MarketPulse: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterSortType>('market_cap');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const {
    data: coins,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<Coin[]>('/api/market', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  const handleRefresh = async () => {
    // Trigger haptic if in Telegram
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    await mutate();
  };

  const handleFilterChange = (filter: FilterSortType) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
    setActiveFilter(filter);
  };

  // Filter & sort coins
  const processedCoins = useMemo(() => {
    if (!coins) return [];

    let filtered = coins;

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q)
      );
    }

    // Sort by filter
    const sorted = [...filtered];
    if (activeFilter === 'gainers') {
      sorted.sort(
        (a, b) =>
          (b.price_change_percentage_24h ?? 0) -
          (a.price_change_percentage_24h ?? 0)
      );
    } else if (activeFilter === 'losers') {
      sorted.sort(
        (a, b) =>
          (a.price_change_percentage_24h ?? 0) -
          (b.price_change_percentage_24h ?? 0)
      );
    } else {
      // market_cap
      sorted.sort((a, b) => (a.market_cap_rank ?? 999) - (b.market_cap_rank ?? 999));
    }

    return sorted;
  }, [coins, searchQuery, activeFilter]);

  // Format currency helpers
  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  };

  const formatMarketCap = (num?: number) => {
    if (!num) return '$0';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString('en-US')}`;
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-4 pb-28 font-mono text-zinc-100 select-none">
      {/* Terminal System Header */}
      <header className="mb-4 p-3 bg-zinc-950/80 border border-emerald-500/40 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden">
        {/* Glow scanline indicator */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0" />

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 tracking-wider">
              SYS.PULSE // MARKET_RADAR
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-ping" />
              LIVE 30s
            </span>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isValidating}
              title="Обновить котировки"
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-emerald-950 border border-zinc-700 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-400 rounded text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isValidating ? 'animate-spin text-emerald-400' : ''
                }`}
              />
              <span className="text-[10px] hidden sm:inline">REFRESH</span>
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="text-[11px] text-zinc-400 flex flex-wrap items-center justify-between border-t border-zinc-800/80 pt-2 mt-1">
          <span className="text-zinc-500">
            NET: <span className="text-emerald-400">MAINNET_FEED</span>
          </span>
          <span className="text-zinc-500">
            RECORDS: <span className="text-zinc-200">{processedCoins.length}/20</span>
          </span>
          <span className="text-zinc-500">
            CACHE: <span className="text-emerald-400">30s TTL</span>
          </span>
        </div>
      </header>

      {/* Terminal Search Bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500 font-bold text-xs">
          &gt;_
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH COIN (BTC, SOL, ETH)..."
          className="w-full bg-black border border-zinc-800 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30 rounded-lg pl-9 pr-8 py-2.5 text-xs text-emerald-300 placeholder-zinc-600 outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 text-xs"
          >
            [X]
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleFilterChange('market_cap')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
            activeFilter === 'market_cap'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Капитализация</span>
        </button>

        <button
          onClick={() => handleFilterChange('gainers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
            activeFilter === 'gainers'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Рост (24h)</span>
        </button>

        <button
          onClick={() => handleFilterChange('losers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
            activeFilter === 'losers'
              ? 'bg-rose-950/50 border-rose-500/80 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          <span>Падение (24h)</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-2 py-4">
          <div className="text-xs text-emerald-500/80 animate-pulse flex items-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span>&gt; CONNECTING COINGECKO TERMINAL FEED... [PLEASE WAIT]</span>
          </div>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-zinc-950 border border-zinc-800/80 rounded-lg animate-pulse flex items-center justify-between px-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800" />
                <div className="space-y-1.5">
                  <div className="w-16 h-3.5 bg-zinc-800 rounded" />
                  <div className="w-24 h-2.5 bg-zinc-900 rounded" />
                </div>
              </div>
              <div className="space-y-1.5 text-right">
                <div className="w-20 h-3.5 bg-zinc-800 rounded ml-auto" />
                <div className="w-14 h-2.5 bg-zinc-900 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message with Fallback Retry */}
      {error && !isLoading && (
        <div className="p-4 mb-4 bg-rose-950/30 border border-rose-500/40 rounded-lg text-xs text-rose-300 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>CONNECTION_WARNING: Failed to fetch live data</span>
          </div>
          <p className="text-zinc-400 text-[11px]">
            {error.message}. Displaying cached or fallback data if available.
          </p>
          <button
            onClick={() => mutate()}
            className="self-start px-3 py-1 bg-rose-900/40 hover:bg-rose-900 border border-rose-500/50 rounded text-rose-200 mt-1"
          >
            &gt; RETRY_COMMAND
          </button>
        </div>
      )}

      {/* Empty Search Result */}
      {!isLoading && processedCoins.length === 0 && (
        <div className="p-8 text-center bg-zinc-950 border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-xs">
          <p className="text-emerald-400 mb-1">&gt; 404: NO_COINS_MATCHING_CRITERIA</p>
          <p className="text-[11px]">Query: &quot;{searchQuery}&quot;</p>
        </div>
      )}

      {/* Coins List */}
      {!isLoading && (
        <div className="space-y-2">
          {processedCoins.map((coin) => {
            const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;
            const changeFormatted = `${isPositive ? '+' : ''}${(
              coin.price_change_percentage_24h ?? 0
            ).toFixed(2)}%`;

            return (
              <div
                key={coin.id}
                className="group p-3 bg-zinc-950 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-emerald-500/50 rounded-lg transition-all flex items-center justify-between gap-2 relative overflow-hidden"
              >
                {/* Left side: Rank, Icon, Symbol, Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Rank */}
                  <span className="text-[10px] text-zinc-600 group-hover:text-emerald-500/80 w-6 font-bold">
                    #{String(coin.market_cap_rank ?? '--').padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className="relative w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {coin.image && !imageErrors[coin.id] ? (
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover rounded-full"
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [coin.id]: true }))
                        }
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400">
                        {coin.symbol.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Symbol & Name */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors uppercase">
                        {coin.symbol}
                      </span>
                      <span className="text-[10px] text-zinc-500">/USD</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate max-w-[110px] sm:max-w-[180px]">
                      {coin.name}
                    </p>
                  </div>
                </div>

                {/* Right side: Price & 24h Change */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-zinc-100 tracking-tight">
                    {formatPrice(coin.current_price)}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        isPositive
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                          : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                      }`}
                    >
                      {isPositive ? '▲ ' : '▼ '}
                      {changeFormatted}
                    </span>

                    <span className="text-[9px] text-zinc-500 hidden sm:inline">
                      MCap: {formatMarketCap(coin.market_cap)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Terminal Footer Indicator */}
      <footer className="mt-6 pt-3 border-t border-zinc-900 text-center text-[10px] text-zinc-600 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-emerald-500">&gt;&gt;</span>
          <span>CRYPTO_PULSE COINGECKO FEED TERMINAL</span>
          <span className="text-emerald-500">&lt;&lt;</span>
        </div>
        <p className="text-zinc-700">SECURE DISPATCH // TELEGRAM WEBAPP READY</p>
      </footer>
    </section>
  );
};
