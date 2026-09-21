import { NextResponse } from 'next/server';
import { Coin } from '@/types/market';

export const revalidate = 30; // Revalidate cache every 30 seconds

// In-memory fallback cache to guarantee uptime if CoinGecko rate limits (HTTP 429)
let cachedCoins: Coin[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 30 * 1000;

const FALLBACK_TOP_COINS: Coin[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 96450,
    market_cap: 1912400000000,
    market_cap_rank: 1,
    total_volume: 42150000000,
    high_24h: 97800,
    low_24h: 95100,
    price_change_percentage_24h: 1.84,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2740.5,
    market_cap: 330200000000,
    market_cap_rank: 2,
    total_volume: 24800000000,
    high_24h: 2810,
    low_24h: 2680,
    price_change_percentage_24h: -0.92,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.0,
    market_cap: 120500000000,
    market_cap_rank: 3,
    total_volume: 68100000000,
    high_24h: 1.002,
    low_24h: 0.998,
    price_change_percentage_24h: 0.02,
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 642.3,
    market_cap: 93800000000,
    market_cap_rank: 4,
    total_volume: 1420000000,
    high_24h: 655,
    low_24h: 630,
    price_change_percentage_24h: 2.15,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 188.75,
    market_cap: 89400000000,
    market_cap_rank: 5,
    total_volume: 7600000000,
    high_24h: 194.2,
    low_24h: 182.1,
    price_change_percentage_24h: 5.42,
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 2.48,
    market_cap: 142000000000,
    market_cap_rank: 6,
    total_volume: 11200000000,
    high_24h: 2.65,
    low_24h: 2.38,
    price_change_percentage_24h: -3.18,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.264,
    market_cap: 38700000000,
    market_cap_rank: 7,
    total_volume: 3800000000,
    high_24h: 0.285,
    low_24h: 0.252,
    price_change_percentage_24h: 4.87,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.782,
    market_cap: 27900000000,
    market_cap_rank: 8,
    total_volume: 1950000000,
    high_24h: 0.814,
    low_24h: 0.761,
    price_change_percentage_24h: 1.45,
  },
  {
    id: "steth",
    symbol: "steth",
    name: "Lido Staked Ether",
    image: "https://assets.coingecko.com/coins/images/13442/large/steth_logo.png",
    current_price: 2736.2,
    market_cap: 26800000000,
    market_cap_rank: 9,
    total_volume: 85000000,
    high_24h: 2805,
    low_24h: 2675,
    price_change_percentage_24h: -0.89,
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 28.45,
    market_cap: 11600000000,
    market_cap_rank: 10,
    total_volume: 680000000,
    high_24h: 29.8,
    low_24h: 27.5,
    price_change_percentage_24h: -2.34,
  },
  {
    id: "sui",
    symbol: "sui",
    name: "Sui",
    image: "https://assets.coingecko.com/coins/images/26375/large/sui-ocean-square.png",
    current_price: 3.14,
    market_cap: 9800000000,
    market_cap_rank: 11,
    total_volume: 1850000000,
    high_24h: 3.32,
    low_24h: 2.98,
    price_change_percentage_24h: 7.21,
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 18.25,
    market_cap: 11400000000,
    market_cap_rank: 12,
    total_volume: 720000000,
    high_24h: 18.9,
    low_24h: 17.8,
    price_change_percentage_24h: 3.12,
  },
  {
    id: "shiba-inu",
    symbol: "shib",
    name: "Shiba Inu",
    image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
    current_price: 0.0000185,
    market_cap: 10900000000,
    market_cap_rank: 13,
    total_volume: 890000000,
    high_24h: 0.0000192,
    low_24h: 0.0000179,
    price_change_percentage_24h: -1.65,
  },
  {
    id: "stellar",
    symbol: "xlm",
    name: "Stellar",
    image: "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png",
    current_price: 0.325,
    market_cap: 9800000000,
    market_cap_rank: 14,
    total_volume: 540000000,
    high_24h: 0.342,
    low_24h: 0.315,
    price_change_percentage_24h: 6.18,
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 6.84,
    market_cap: 9850000000,
    market_cap_rank: 15,
    total_volume: 490000000,
    high_24h: 7.12,
    low_24h: 6.65,
    price_change_percentage_24h: -4.12,
  },
  {
    id: "pepe",
    symbol: "pepe",
    name: "Pepe",
    image: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.png",
    current_price: 0.0000112,
    market_cap: 4700000000,
    market_cap_rank: 16,
    total_volume: 1350000000,
    high_24h: 0.0000121,
    low_24h: 0.0000108,
    price_change_percentage_24h: 8.94,
  },
  {
    id: "uniswap",
    symbol: "uni",
    name: "Uniswap",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    current_price: 9.42,
    market_cap: 5650000000,
    market_cap_rank: 17,
    total_volume: 380000000,
    high_24h: 9.85,
    low_24h: 9.15,
    price_change_percentage_24h: 1.05,
  },
  {
    id: "monero",
    symbol: "xmr",
    name: "Monero",
    image: "https://assets.coingecko.com/coins/images/69/large/monero_logo.png",
    current_price: 198.4,
    market_cap: 3650000000,
    market_cap_rank: 18,
    total_volume: 120000000,
    high_24h: 202.5,
    low_24h: 195.0,
    price_change_percentage_24h: 0.45,
  },
  {
    id: "near",
    symbol: "near",
    name: "NEAR Protocol",
    image: "https://assets.coingecko.com/coins/images/10365/large/near.png",
    current_price: 4.88,
    market_cap: 6020000000,
    market_cap_rank: 19,
    total_volume: 480000000,
    high_24h: 5.15,
    low_24h: 4.72,
    price_change_percentage_24h: -5.32,
  },
  {
    id: "aptos",
    symbol: "apt",
    name: "Aptos",
    image: "https://assets.coingecko.com/coins/images/26455/large/aptos_round.png",
    current_price: 7.95,
    market_cap: 4250000000,
    market_cap_rank: 20,
    total_volume: 310000000,
    high_24h: 8.35,
    low_24h: 7.8,
    price_change_percentage_24h: 3.75,
  },
];

export async function GET() {
  const now = Date.now();

  // If memory cache is fresh (< 30 sec), return it immediately
  if (cachedCoins && now - lastFetchTime < CACHE_DURATION_MS) {
    return NextResponse.json(cachedCoins, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache': 'HIT',
      },
    });
  }

  const url =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h';

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'CryptoPulse-Terminal/1.0',
    };

    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 30 }, // Next.js fetch cache for 30 seconds
    });

    if (!response.ok) {
      // CoinGecko 429 or rate limit -> fallback safely
      console.warn(
        `CoinGecko API responded with status ${response.status}. Using fallback/cached data.`
      );
      if (cachedCoins) {
        return NextResponse.json(cachedCoins, {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            'X-Cache': 'STALE-FALLBACK',
          },
        });
      }

      return NextResponse.json(FALLBACK_TOP_COINS, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Cache': 'STATIC-FALLBACK',
        },
      });
    }

    const data: Coin[] = await response.json();
    cachedCoins = data;
    lastFetchTime = now;

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);

    if (cachedCoins) {
      return NextResponse.json(cachedCoins, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Cache': 'ERROR-CACHED',
        },
      });
    }

    return NextResponse.json(FALLBACK_TOP_COINS, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache': 'ERROR-FALLBACK',
      },
    });
  }
}
