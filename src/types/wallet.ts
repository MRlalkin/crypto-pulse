export interface Transaction {
  hash: string;
  timeStamp: string | number;
  value: string; // Amount in native token (ETH or POL)
  from: string;
  to: string;
  isIncoming: boolean;
}

export interface WalletData {
  address: string;
  chainId: number;
  balance: string;
  symbol: string;
  explorerUrl: string;
  transactions: Transaction[];
  balanceEth?: string; // Optional alias for backward-compatibility
}

export interface ChainOption {
  id: number;
  name: string;
  shortName: string;
  symbol: string;
  explorerUrl: string;
  color: string;
}

export const SUPPORTED_CHAINS_LIST: ChainOption[] = [
  {
    id: 1,
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    symbol: 'ETH',
    explorerUrl: 'https://etherscan.io',
    color: '#627EEA',
  },
  {
    id: 8453,
    name: 'Base',
    shortName: 'Base',
    symbol: 'ETH',
    explorerUrl: 'https://basescan.org',
    color: '#0052FF',
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    symbol: 'ETH',
    explorerUrl: 'https://arbiscan.io',
    color: '#28A0F0',
  },
  {
    id: 137,
    name: 'Polygon',
    shortName: 'Polygon',
    symbol: 'POL',
    explorerUrl: 'https://polygonscan.com',
    color: '#8247E5',
  },
];
