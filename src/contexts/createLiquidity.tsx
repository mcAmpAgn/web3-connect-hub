import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletContextState } from "@solana/wallet-adapter-react";

export async function createLiquidity(
    connection: Connection,
    wallet: WalletContextState,
    baseMint: PublicKey,
    baseDecimal: number,
    quoteMint: PublicKey,
    quoteDecimal: number,
    orderSize: number,
    tickSize: number,
    marketId: PublicKey,
    baseAmount: number,
    quoteAmount: number,
) {
    let lpMint: PublicKey | null = null;
    
    if (wallet.publicKey != null) {
       
        return null;
     
    }
}