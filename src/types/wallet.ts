export interface Transaction {
  hash: string;
  timeStamp: string | number;
  value: string; // Amount in ETH
  from: string;
  to: string;
  isIncoming: boolean;
}

export interface WalletData {
  address: string;
  balanceEth: string;
  transactions: Transaction[];
}
