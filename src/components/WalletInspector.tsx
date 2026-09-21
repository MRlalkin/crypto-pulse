'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { isAddress } from 'viem';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  Shield,
  Clock,
  AlertTriangle,
  History,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';
import { WalletData } from '@/types/wallet';
import { Coin } from '@/types/market';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  });

const DEFAULT_WALLETS = [
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // vitalik.eth
  '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', // Ethereum Foundation
  '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', // Binance
];

export const WalletInspector: React.FC = () => {
  const [addressInput, setAddressInput] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string>('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  const [recentWallets, setRecentWallets] = useState<string[]>(DEFAULT_WALLETS);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Trigger Telegram WebApp Haptic Feedback safely
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(style === 'medium' ? 25 : 15);
      }
    } catch {
      // Ignore if not supported in browser environment
    }
  };

  // Load recent wallets from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('crypto_pulse_recent_wallets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentWallets(parsed.slice(0, 3));
          setSelectedAddress(parsed[0]);
          setAddressInput(parsed[0]);
          return;
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    setAddressInput(DEFAULT_WALLETS[0]);
  }, []);

  // Save address to recent wallets
  const saveRecentWallet = (addr: string) => {
    setRecentWallets((prev) => {
      const filtered = prev.filter((a) => a.toLowerCase() !== addr.toLowerCase());
      const updated = [addr, ...filtered].slice(0, 3);
      try {
        localStorage.setItem('crypto_pulse_recent_wallets', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Fetch ETH current market price for USD conversion
  const { data: marketCoins } = useSWR<Coin[]>('/api/market', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  });

  const ethPriceUsd = React.useMemo(() => {
    const ethCoin = marketCoins?.find(
      (c) => c.symbol.toLowerCase() === 'eth' || c.id === 'ethereum'
    );
    return ethCoin?.current_price ?? 2740.5;
  }, [marketCoins]);

  // Fetch wallet data via SWR
  const {
    data: walletData,
    error: fetchError,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<WalletData>(
    selectedAddress ? `/api/wallet?address=${selectedAddress}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  const handleSearch = useCallback(
    (targetAddr?: string) => {
      const addrToInspect = (targetAddr || addressInput).trim();

      if (!addrToInspect) {
        setValidationError('Введите адрес кошелька Ethereum');
        return;
      }

      if (!isAddress(addrToInspect)) {
        setValidationError('Неверный формат адреса Ethereum (ожидается 0x... 40 hex-символов)');
        return;
      }

      setValidationError(null);
      triggerHaptic('medium');
      setSelectedAddress(addrToInspect);
      saveRecentWallet(addrToInspect);
    },
    [addressInput]
  );

  const handleSelectRecent = (addr: string) => {
    triggerHaptic('light');
    setAddressInput(addr);
    setValidationError(null);
    setSelectedAddress(addr);
    saveRecentWallet(addr);
  };

  const handleCopy = (text: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const shortenAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (ts: string | number) => {
    const timeNum = Number(ts) * (String(ts).length <= 10 ? 1000 : 1);
    const d = new Date(timeNum);
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const usdValue = walletData
    ? (parseFloat(walletData.balanceEth) * ethPriceUsd).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    : '$0.00';

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-4 pb-28 font-mono text-zinc-100 select-none">
      {/* Terminal Inspector Header */}
      <header className="mb-4 p-3 bg-[#0B0E14] border border-emerald-500/40 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 tracking-wider">
              SYS.WALLET // INSPECTOR
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            RPC_MAINNET
          </span>
        </div>

        <div className="text-[11px] text-zinc-400 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-2">
          <span className="text-zinc-500">
            ETH_INDEX: <span className="text-emerald-400">${ethPriceUsd.toLocaleString('en-US')}</span>
          </span>
          <span className="text-zinc-500">
            MODE: <span className="text-zinc-200">READ_ONLY_AUDIT</span>
          </span>
        </div>
      </header>

      {/* Address Input & Search */}
      <div className="space-y-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500 font-bold text-xs">
              &gt;_
            </div>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="0x... (ETH ADDRESS OR ENS)"
              className="w-full bg-[#0B0E14] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-lg pl-9 pr-3 py-2.5 text-xs text-emerald-300 placeholder-zinc-600 outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={isLoading || isValidating}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#1E293B] hover:bg-emerald-950 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>ПРО Humans/VERIFY</span>
          </button>
        </div>

        {/* Client Validation Error Banner */}
        {validationError && (
          <div className="p-2.5 bg-rose-950/40 border border-rose-500/60 rounded-md text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Network / Fetch Error Banner */}
        {fetchError && !isLoading && (
          <div className="p-2.5 bg-rose-950/40 border border-rose-500/60 rounded-md text-xs text-rose-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Ошибка сети: не удалось получить данные кошелька</span>
            </div>
            <button
              onClick={() => mutate()}
              className="px-2 py-0.5 bg-rose-900 border border-rose-600 rounded text-[10px] text-rose-100 hover:bg-rose-800"
            >
              [RETRY]
            </button>
          </div>
        )}
      </div>

      {/* Recent Wallets Chips */}
      {recentWallets.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-2">
            <History className="w-3 h-3 text-emerald-500/70" />
            <span>НЕДАВНИЕ КОШЕЛЬКИ:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentWallets.map((addr) => {
              const isCurrent =
                selectedAddress.toLowerCase() === addr.toLowerCase();
              return (
                <button
                  key={addr}
                  onClick={() => handleSelectRecent(addr)}
                  className={`px-2.5 py-1 rounded-md text-xs border font-mono transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                      : 'bg-[#1E293B]/70 border-slate-700 text-zinc-400 hover:border-emerald-500/40 hover:text-zinc-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCurrent ? 'bg-emerald-400' : 'bg-zinc-600'
                    }`}
                  />
                  <span>{shortenAddress(addr)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 py-2">
          <div className="p-5 bg-[#1E293B]/40 border border-slate-800 rounded-lg animate-pulse space-y-3">
            <div className="w-28 h-3.5 bg-slate-700 rounded" />
            <div className="w-48 h-8 bg-slate-700 rounded" />
            <div className="w-32 h-3 bg-slate-800 rounded" />
          </div>

          <div className="space-y-2">
            <div className="w-36 h-3 bg-slate-800 rounded mb-2" />
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-[#1E293B]/40 border border-slate-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Balance Card */}
      {!isLoading && walletData && (
        <div className="space-y-5">
          <div className="p-4 sm:p-5 bg-[#1E293B]/80 border border-emerald-500/40 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.08)] relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>NATIVE_ETH_BALANCE</span>
              </span>
              <span className="text-[10px] text-emerald-400 border border-emerald-800/80 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                AUDITED
              </span>
            </div>

            {/* ETH Balance */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                {walletData.balanceEth}
              </span>
              <span className="text-sm font-bold text-emerald-400">ETH</span>
            </div>

            {/* USD Conversion */}
            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
              <span>≈ {usdValue}</span>
              <span className="text-[10px] text-zinc-500">(@ ${ethPriceUsd.toFixed(2)}/ETH)</span>
            </div>

            {/* Address Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-zinc-500 text-[10px]">ADDRESS:</span>
                <span className="text-zinc-200 truncate font-mono text-[11px] sm:text-xs">
                  {walletData.address}
                </span>
              </div>
              <button
                onClick={() => handleCopy(walletData.address)}
                className="text-zinc-400 hover:text-emerald-300 transition-colors p-1"
                title="Копировать адрес"
              >
                {copiedHash === walletData.address ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Last 5 Transactions */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2.5">
              <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>ПОСЛЕДНИЕ 5 ТРАНЗАКЦИЙ (ETHERSCAN)</span>
              </span>
              <span className="text-[10px] text-zinc-500">LIMIT: 5 TX</span>
            </div>

            {walletData.transactions.length === 0 ? (
              <div className="p-6 text-center bg-[#1E293B]/40 border border-dashed border-slate-800 rounded-lg text-zinc-500 text-xs">
                &gt; NO_TRANSACTIONS_FOUND_FOR_ADDRESS
              </div>
            ) : (
              <div className="space-y-2">
                {walletData.transactions.map((tx) => {
                  return (
                    <div
                      key={tx.hash}
                      className="p-3 bg-[#1E293B]/60 hover:bg-[#1E293B] border border-slate-800 hover:border-emerald-500/40 rounded-lg transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      {/* Left: Direction Icon & Address Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                            tx.isIncoming
                              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                              : 'bg-rose-950/80 border-rose-500/40 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                          }`}
                        >
                          {tx.isIncoming ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold text-[11px] uppercase ${
                                tx.isIncoming ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {tx.isIncoming ? 'Входящая' : 'Исходящая'}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              • {formatTimestamp(tx.timeStamp)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                            <span className="text-zinc-600">
                              {tx.isIncoming ? 'От:' : 'Кому:'}
                            </span>
                            <span className="truncate max-w-[120px] sm:max-w-[170px] text-zinc-300 font-mono">
                              {shortenAddress(tx.isIncoming ? tx.from : tx.to)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount & Etherscan Link */}
                      <div className="text-right flex-shrink-0 space-y-1">
                        <div
                          className={`font-bold text-xs ${
                            tx.isIncoming ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {tx.isIncoming ? '+' : '-'}
                          {tx.value} ETH
                        </div>

                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => triggerHaptic('light')}
                          className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-emerald-300 transition-colors border border-slate-700/80 hover:border-emerald-500/50 bg-[#0B0E14] px-1.5 py-0.5 rounded"
                          title="Открыть в Etherscan"
                        >
                          <span className="font-mono">{tx.hash.slice(0, 6)}...</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
