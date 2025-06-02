import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, MintLayout, Token } from '@solana/spl-token';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair, TransactionInstruction, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Dispatch, SetStateAction } from 'react';

import { Metaplex, MetaplexFileTag, walletAdapterIdentity, irysStorage } from '@metaplex-foundation/js';

export async function createSPLToken(owner: PublicKey, wallet: WalletContextState, connection: Connection, quantity: number, decimals: number, isChecked: boolean, tokenName: string, symbol: string, metadataURL: string, description: string, file: Readonly<{
    buffer: Buffer;
    fileName: string;
    displayName: string;
    uniqueName: string;
    contentType: string | null;
    extension: string | null;
    tags: MetaplexFileTag[];
}> | undefined,
    metadataMethod: string) {
    try {
        console.log("creating spl token")

        const metaplex = Metaplex.make(connection)
            .use(walletAdapterIdentity(wallet))
            .use(irysStorage({
                address: 'https://node1.irys.xyz',
                providerUrl: "https://api.devnet.solana.com",
                timeout: 60000,
            }));

        const mint_rent = await Token.getMinBalanceRentForExemptMint(connection);

        const mint_account = Keypair.generate();

        let InitMint: TransactionInstruction

       

        let URI: string = ''
        console.log("start =====>");

        if (metadataMethod == 'url') {
            if (metadataURL != '') {
                URI = metadataURL
            }
            else {
                throw new Error('Please provide a metadata URL!')
            }
        }
        else {
            if (file) {
                console.log("upload ===>");
                const ImageUri = await metaplex.storage().upload(file);
                console.log("imageuri ===>", ImageUri);
                if (ImageUri) {
                    const { uri } = await metaplex.nfts().uploadMetadata({
                        name: tokenName,
                        symbol: symbol,
                        description: description,
                        image: ImageUri,
                    })
                    console.log("uri ===>", uri);
                    if (uri) {
                        URI = uri
                    }
                }
            }
            else {
                throw new Error('Please provide an image file!')
            }
        }

        if (URI != '') {

            

            

            const createMintAccountInstruction = await SystemProgram.createAccount({
                fromPubkey: owner,
                newAccountPubkey: mint_account.publicKey,
                space: MintLayout.span,
                lamports: mint_rent,
                programId: TOKEN_PROGRAM_ID,
            });

            if (isChecked) {
                InitMint = await Token.createInitMintInstruction(
                    TOKEN_PROGRAM_ID,
                    mint_account.publicKey,
                    decimals,
                    owner,
                    owner
                );

            } else {
                InitMint = await Token.createInitMintInstruction(
                    TOKEN_PROGRAM_ID,
                    mint_account.publicKey,
                    decimals,
                    owner,
                    null
                );

            };

            const associatedTokenAccount = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                mint_account.publicKey,
                owner
            );

            const createATAInstruction = await Token.createAssociatedTokenAccountInstruction(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                mint_account.publicKey,
                associatedTokenAccount,
                owner,
                owner
            );

            const mintInstruction = await Token.createMintToInstruction(
                TOKEN_PROGRAM_ID,
                mint_account.publicKey,
                associatedTokenAccount,
                owner,
                [],
                quantity * 10 ** decimals
            );

            

            console.log("confirming");
            if (wallet.publicKey == null) return;
           
            if (wallet.signTransaction == undefined) return undefined;
            const blockHash = await connection.getLatestBlockhash();
           
         
            return undefined;
        }

    } catch (error) {
        console.log("error: ", error);
        throw error;
    }

}