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
        try {
            // Dynamic import of heavy Raydium SDK
            const [
                { Liquidity, TokenAccount, MAINNET_PROGRAM_ID, SPL_ACCOUNT_LAYOUT, TxVersion, ComputeBudgetConfig },
                { BN }
            ] = await Promise.all([
                import('@raydium-io/raydium-sdk'),
                import('@project-serum/anchor')
            ]);

            const raydiumProgram = MAINNET_PROGRAM_ID;

            const walletTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, {
                programId: TOKEN_PROGRAM_ID
            });
            
            const tokenAccountsInfo: TokenAccount[] = walletTokenAccount.value.map((i) => ({
                pubkey: i.pubkey,
                programId: i.account.owner,
                accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data)
            }));

            console.log("tokenAccountsinfo ===>", tokenAccountsInfo);
            console.log("marketid===>", marketId.toBase58());

            const budget: ComputeBudgetConfig = {
                units: 600000,
                microLamports: 25000
            };

            console.log("budget ===>", budget);
            console.log("before creating instruction!!!");

            const { innerTransactions, address } = await Liquidity.makeCreatePoolV4InstructionV2Simple({
                connection,
                programId: raydiumProgram.AmmV4,
                marketInfo: {
                    programId: raydiumProgram.OPENBOOK_MARKET,
                    marketId
                },
                associatedOnly: false,
                ownerInfo: {
                    feePayer: wallet.publicKey,
                    wallet: wallet.publicKey,
                    tokenAccounts: tokenAccountsInfo,
                    useSOLBalance: true
                },
                baseMintInfo: {
                    mint: baseMint,
                    decimals: baseDecimal
                },
                quoteMintInfo: {
                    mint: quoteMint,
                    decimals: quoteDecimal
                },
                startTime: new BN(Date.now() / 1000),
                baseAmount: new BN(baseAmount * 10 ** baseDecimal),
                quoteAmount: new BN(quoteAmount * 10 ** quoteDecimal),
                computeBudgetConfig: budget,
                checkCreateATAOwner: true,
                makeTxVersion: TxVersion.LEGACY,
                feeDestinationId: new PublicKey("7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5")
            });

            console.log("inner transactions ===>", innerTransactions);
            console.log("ammId ===>", address.ammId.toBase58());
            console.log("marketId ====>", address.marketId.toBase58());
            console.log("lpMint ===>", address.lpMint.toBase58());
            
            lpMint = address.lpMint;

            for (let i = 0; i < innerTransactions.length; i++) {
                const transaction = new Transaction();
                for (let j = 0; j < innerTransactions[i].instructions.length; j++) {
                    transaction.add(innerTransactions[i].instructions[j]);
                }
                
                if (wallet != undefined && wallet.signTransaction != undefined) {
                    try {
                        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                        transaction.feePayer = wallet.publicKey;
                        console.log(await connection.simulateTransaction(transaction));

                        let signedTx = await wallet.signTransaction(transaction);
                        const signature = await connection.sendRawTransaction(signedTx.serialize());
                        console.log("signature ====>", signature);
                    } catch (err) {
                        console.log("transaction error ===>", err);
                    }
                }
            }
        } catch (err) {
            console.log("creating liquidity error ===>", err);
        }
        
        return lpMint;
    }
}