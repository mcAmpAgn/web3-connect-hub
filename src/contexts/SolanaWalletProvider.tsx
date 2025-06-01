import React, { ReactNode } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

interface SolanaWalletProviderProps {
  children: ReactNode;
}

// Solana RPC endpoint - defaults to devnet
const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

export const SolanaWalletProvider: React.FC<SolanaWalletProviderProps> = ({ children }) => {
  // Configure wallets - only include the most popular ones to reduce bundle size
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;