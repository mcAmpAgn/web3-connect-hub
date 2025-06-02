'use client';
import { useState, useRef, Suspense } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import lightweight UI components (CORRECT)
import { Alert } from '@/components/UI/Alert';
import { Snackbar } from '@/components/UI/Snackbar';

// Dynamically import heavy components
const LandingHeader = dynamic(() => import('@/components/LandingHeader/LandingHeader'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-800 animate-pulse"></div>
});

interface AlertState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

let mintAddress: PublicKey | undefined = undefined;
let marketId: PublicKey | null = null;
let lpMint: PublicKey | null | undefined = null;

export default function CreateTokenPage() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const router = useRouter();
    
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenLogo, setTokenLogo] = useState<File | null>();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [tokenDecimal, setTokenDecimal] = useState(9);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [solBalance, setSolBalance] = useState('0');
    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: '',
        severity: undefined,
    });
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const sendLanding = () => {
        router.push('/');
    };

    // Dynamic import and execution of token creation
    const handleCreateToken = async () => {
        if (!tokenName || !tokenSymbol || !tokenLogo || !tokenBalance) {
            setAlertState({
                open: true,
                message: 'Please fill all required fields',
                severity: 'error',
            });
            return;
        }

        if (!wallet.publicKey) {
            setAlertState({
                open: true,
                message: 'Please connect your wallet first',
                severity: 'error',
            });
            return;
        }

        setIsLoading(true);
        setAlertState({
            open: true,
            message: 'Loading token creation tools...',
            severity: 'info',
        });

        try {
            // Dynamic import of heavy packages
            const [
                { toMetaplexFileFromBrowser },
                { createSPLToken }
            ] = await Promise.all([
                import('@metaplex-foundation/js'),
                import('@/contexts/createSPLToken')
            ]);

            const _file = await toMetaplexFileFromBrowser(tokenLogo);
            
            setAlertState({
                open: true,
                message: 'Creating token...',
                severity: 'info',
            });

            mintAddress = await createSPLToken.createSPLToken(
                wallet.publicKey, 
                wallet, 
                connection, 
                tokenBalance, 
                tokenDecimal, 
                true, 
                tokenName, 
                tokenSymbol, 
                "", 
                "", 
                _file, 
                "string"
            );

            setAlertState({
                open: true,
                message: 'Token created successfully!',
                severity: 'success',
            });
            
            setStep(2);
        } catch (error) {
            console.error('Token creation error:', error);
            setAlertState({
                open: true,
                message: 'Failed to create token. Please try again.',
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateMarket = async () => {
        const baseMint = mintAddress || new PublicKey("AXVANX9Exmoghok94dQkdLbQddpe9NjQkQ9heEcauDiF");
        const baseDecimal = tokenDecimal;
        const quoteMint = new PublicKey("So11111111111111111111111111111111111111112");
        const quoteDecimal = 9;
        const orderSize = 1;
        const tickSize = 0.01;

        setIsLoading(true);
        setAlertState({
            open: true,
            message: 'Loading market creation tools...',
            severity: 'info',
        });

        try {
            const { createMarket } = await import('@/contexts/createMarket');
            
            setAlertState({
                open: true,
                message: 'Creating market...',
                severity: 'info',
            });

            marketId = await createMarket(connection, wallet, baseMint, baseDecimal, quoteMint, quoteDecimal, orderSize, tickSize);
            console.log("creating market id ====>", marketId);
            
            setAlertState({
                open: true,
                message: 'Market created successfully!',
                severity: 'success',
            });
            
            setStep(5);
        } catch (error) {
            console.error('Market creation error:', error);
            setAlertState({
                open: true,
                message: 'Failed to create market. Please try again.',
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clickRevokeMint = async () => {
        if (!mintAddress) {
            setAlertState({
                open: true,
                message: 'Mint Address Not Set',
                severity: 'error',
            });
            return;
        }
        
        if (!wallet.publicKey) {
            setAlertState({
                open: true,
                message: 'Wallet Not Connected',
                severity: 'error',
            });
            return;
        }

        setIsLoading(true);
        setAlertState({
            open: true,
            message: 'Loading revoke tools...',
            severity: 'info',
        });

        try {
            const { revokeMintAuthority } = await import('@/contexts/revokeMintAuthority');
            
            setAlertState({
                open: true,
                message: 'Revoking mint authority...',
                severity: 'info',
            });

            await revokeMintAuthority(connection, wallet, mintAddress);
            
            setAlertState({
                open: true,
                message: 'Mint authority revoked successfully!',
                severity: 'success',
            });
            
            setStep(3);
        } catch (error) {
            console.error('Revoke mint error:', error);
            setAlertState({
                open: true,
                message: 'Failed to revoke mint authority.',
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clickRevokeFreeze = async () => {
        if (!mintAddress) {
            setAlertState({
                open: true,
                message: 'Mint Address Not Set',
                severity: 'error',
            });
            return;
        }

        setIsLoading(true);
        setAlertState({
            open: true,
            message: 'Loading freeze revoke tools...',
            severity: 'info',
        });

        try {
            const { revokeFreezeAuthority } = await import('@/contexts/revokeFreezeAuthority');
            
            setAlertState({
                open: true,
                message: 'Revoking freeze authority...',
                severity: 'info',
            });

            await revokeFreezeAuthority(connection, wallet, mintAddress);
            
            setAlertState({
                open: true,
                message: 'Freeze authority revoked successfully!',
                severity: 'success',
            });
            
            setStep(4);
        } catch (error) {
            console.error('Revoke freeze error:', error);
            setAlertState({
                open: true,
                message: 'Failed to revoke freeze authority.',
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clickAddLiquidity = async () => {
        if (!marketId) {
            setAlertState({
                open: true,
                message: 'Market ID not Set',
                severity: 'error',
            });
            return;
        }
        
        if (!mintAddress) {
            setAlertState({
                open: true,
                message: 'Mint Address Not Set',
                severity: 'error',
            });
            return;
        }

        console.log("Liquidity marketId ====>", marketId);
        const baseMint = mintAddress;
        const baseDecimal = tokenDecimal;
        const quoteMint = new PublicKey("So11111111111111111111111111111111111111112");
        const quoteDecimal = 9;
        const orderSize = 1;
        const tickSize = 0.01;

        console.log("mintaddress ==>", baseMint.toBase58());
        console.log("solbalance ===>", parseFloat(solBalance));

        setIsLoading(true);
        setAlertState({
            open: true,
            message: 'Loading liquidity tools...',
            severity: 'info',
        });

        try {
            const { createLiquidity } = await import('@/contexts/createLiquidity');
            
            setAlertState({
                open: true,
                message: 'Adding liquidity...',
                severity: 'info',
            });

            lpMint = await createLiquidity(
                connection, 
                wallet, 
                baseMint, 
                baseDecimal, 
                quoteMint, 
                quoteDecimal, 
                orderSize, 
                tickSize, 
                marketId, 
                tokenBalance, 
                parseFloat(solBalance)
            );
            
            setAlertState({
                open: true,
                message: 'Liquidity added successfully!',
                severity: 'success',
            });
            
            setStep(6);
        } catch (error) {
            console.error('Add liquidity error:', error);
            setAlertState({
                open: true,
                message: 'Failed to add liquidity.',
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clickBurnToken = async () => {
        if (!wallet.publicKey) {
            setAlertState({
                open: true,
                message: 'Wallet Not Connected',
                severity: 'error',
            });
            return;
        }
        
        if (!lpMint) {
            setAlertState({
                open: true,
                message: 'No LP Token Exists',
                severity: 'error',
            });
            return;
        }

        setIsLoading(true);
        setAlertState({
            open: true,
            message: 'Loading burn tools...',
            severity: 'info',
        });

        try {
            const [
                { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID },
                { burnToken }
            ] = await Promise.all([
                import('@solana/spl-token'),
                import('@/contexts/burnToken')
            ]);

            console.log('lpMint ===>', lpMint);
            const tokenAccountAddress = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID, 
                TOKEN_PROGRAM_ID, 
                lpMint, 
                wallet.publicKey
            );
            console.log('tokenAccountAddress ===>', tokenAccountAddress.toBase58());
            
            setAlertState({
                open: true,
                message: 'Burning tokens...',
                severity: 'info',
            });

            await burnToken(connection, wallet, lpMint, tokenAccountAddress);
            
            setAlertState({
                open: true,
                message: 'Tokens burned successfully!',
                severity: 'success',
            });
            
            setTimeout(() => {
                router.push('/my-token');
            }, 2000);
        } catch (error) {
            console.error('Burn token error:', error);
            setAlertState({
                open: true,
                message: 'Failed to burn tokens.',
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleBig = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleNameChange = (value: string) => {
        setTokenName(value);
    };

    const handleSymbolChange = (value: string) => {
        setTokenSymbol(value);
    };

    const handleLogoFileChange = (files: FileList | null) => {
        if (files) {
            setTokenLogo(files[0]);
            if (files[0]) {
                const imageUrls = Object.values(files).map((file) => URL.createObjectURL(file));
                setImageUrl(imageUrls[0]);
            }
        } else {
            setImageUrl('');
            setTokenLogo(null);
        }
    };

    const handleDecimalChange = (value: string) => {
        setTokenDecimal(parseInt(value));
    };

    const handleBalanceChange = (value: string) => {
        setTokenBalance(parseInt(value));
    };

    const handleSolBalanceChange = (value: string) => {
        setSolBalance(value);
    };

    return (
        <div className="w-full h-full min-h-screen flex items-start pt-6 sm:pt-0 sm:items-center justify-center bg-secondary-200 sm:bg-secondary-300">
            <Suspense fallback={<div className="h-20 bg-gray-800 animate-pulse"></div>}>
                <LandingHeader />
            </Suspense>
            
            {step === 1 && (
                <div className="flex flex-col max-w-[480px] w-full bg-secondary-200 rounded-xl p-6 gap-6">
                    <div className='flex items-center justify-between'>
                        <div className='text-white text-2xl font-semibold'>
                            Create Token
                        </div>
                        <Image
                            src='/icons/x.svg'
                            alt='cross'
                            width={24}
                            height={24}
                            className='cursor-pointer'
                            onClick={sendLanding}
                        />
                    </div>
                    
                    <div className='flex flex-col gap-1'>
                        <p className="text-sm text-secondary-400">Name</p>
                        <input
                            className="w-full rounded-xl text-sm bg-secondary-500 py-3 px-4 placeholder:text-secondary-700 text-white focus:ring-0 focus:border-0 focus:outline-none"
                            placeholder="Token Name"
                            onChange={(e) => handleNameChange(e.target.value)}
                            value={tokenName}
                        />
                    </div>
                    
                    <div className='flex flex-col gap-1'>
                        <p className="text-sm text-secondary-400">Symbol</p>
                        <input
                            className="w-full rounded-xl text-sm bg-secondary-500 py-3 px-4 placeholder:text-secondary-700 text-white focus:ring-0 focus:border-0 focus:outline-none"
                            placeholder="Token Symbol"
                            onChange={(e) => handleSymbolChange(e.target.value)}
                            value={tokenSymbol}
                        />
                    </div>
                    
                    <div className='flex flex-col gap-1'>
                        <p className="text-sm text-secondary-400">Token Logo</p>
                        <div className='w-full relative bg-secondary-500 flex flex-col items-center px-4 py-3 gap-3'>
                            <div className='flex flex-col items-center z-10'>
                                <div className='text-white text-sm font-normal'>
                                    {tokenSymbol || 'Token Symbol'}
                                </div>
                                <div className='text-secondary-700 text-xs font-normal'>
                                    {tokenName || 'Token Name'}
                                </div>
                            </div>
                            <button className='bg-secondary-800 rounded-xl text-white px-4 py-2 text-sm font-semibold z-10' onClick={handleBig}>
                                Upload File
                                <input
                                    type="file"
                                    className='opacity-0 min-h-full min-w-full'
                                    accept='image/png, image/jpeg'
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleLogoFileChange(e.target.files)}
                                />
                            </button>
                            {imageUrl && (
                                <div className='absolute border-2 border-white rounded-lg z-0 '>
                                    <img
                                        src={imageUrl}
                                        alt='token logo'
                                        className='object-cover object-center max-h-[90px] aspect-square '
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className='w-full flex items-center justify-between gap-4'>
                        <div className='w-full flex flex-col gap-1'>
                            <p className="text-sm text-secondary-400">Decimal</p>
                            <input
                                type="number"
                                className="w-full rounded-xl text-sm bg-secondary-500 py-3 px-4 placeholder:text-secondary-700 text-white focus:ring-0 focus:border-0 focus:outline-none"
                                onChange={(e) => handleDecimalChange(e.target.value)}
                                value={tokenDecimal}
                            />
                        </div>
                        <div className='w-full flex flex-col gap-1'>
                            <p className="text-sm text-secondary-400">
                                Token to Mint
                            </p>
                            <input
                                type="number"
                                className="w-full rounded-xl text-sm bg-secondary-500 py-3 px-4 placeholder:text-secondary-700 text-white focus:ring-0 focus:border-0 focus:outline-none"
                                onChange={(e) => handleBalanceChange(e.target.value)}
                                value={tokenBalance}
                            />
                        </div>
                    </div>
                    
                    <div className='flex items-center justify-between'>
                        <div className='text-secondary-400 text-sm font-normal'>
                            Create Token Fee
                        </div>
                        <div className='text-white font-semibold text-sm'>
                            0.62 SOL
                        </div>
                    </div>
                    
                    <button
                        className="w-full py-3 px-6 text-[white] text-sm font-semibold text-center rounded-xl bg-primary-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        onClick={handleCreateToken}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col max-w-[480px] w-full bg-secondary-200 rounded-xl p-6 gap-8">
                    <div className='flex items-center justify-center'>
                        <div className='text-white text-2xl font-semibold'>
                            Revoke Mint Authority
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                        <p className="text-sm text-secondary-400">Token Mint Address</p>
                        <div className='p-2 w-full gap-2 flex items-center text-white rounded-xl bg-secondary-300'>
                            <Image
                                src="/icons/avatar-image.png"
                                alt="avatar image"
                                width={32}
                                height={32}
                                className='object-cover object-center w-8 h-8'
                            />
                            <p className='truncate w-[90%] text-sm'>
                                {mintAddress?.toBase58() || wallet.publicKey?.toBase58()}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button
                            className="w-full py-3 px-6 text-[white] text-sm font-semibold text-center rounded-xl bg-primary-200 disabled:bg-gray-600"
                            onClick={clickRevokeMint}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Revoking...' : 'Revoke it'}
                        </button>
                        <button
                            className="w-full py-3 px-6 text-[white] text-sm font-semibold text-center rounded-xl bg-primary-800"
                            onClick={() => setStep(1)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col max-w-[480px] w-full bg-secondary-200 rounded-xl p-6 gap-8">
                    <div className='flex items-center justify-center'>
                        <div className='text-white text-2xl font-semibold'>
                            Revoke Freezing Authority
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                        <p className="text-sm text-secondary-400">Token Mint Address</p>
                        <div className='p-2 w-full gap-2 flex items-center text-white rounded-xl bg-secondary-300'>
                            <Image
                                src="/icons/avatar-image.png"
                                alt="avatar image"
                                width={32}
                                height={32}
                                className='object-cover object-center w-8 h-8'
                            />
                            <p className='truncate w-[90%] text-sm'>
                                {mintAddress?.toBase58() || wallet.publicKey?.toBase58()}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button
                            className="w-full py-3 px-6 text-[white] text-sm font-semibold text-center rounded-xl bg-primary-200 disabled:bg-gray-600"
                            onClick={clickRevokeFreeze}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Revoking...' : 'Confirm'}
                        </button>
                        <button
                            className="w-full py-3 px-6 text-[white] text-sm font-semibold text-center rounded-xl bg-primary-800"
                            onClick={() => setStep(2)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="flex flex-col max-w-[480px] w-full bg-secondary-200 rounded-xl p-6 gap-6">
                    <div className='flex items-center justify-between'>
                        <div className='text-white text-2xl font-semibold'>
                            Create The Market
                        </div>
                        <Image
                            src='/icons/x.svg'
                            alt='cross'
                            width={24}
                            height={24}
                            className='cursor-pointer'
                            onClick={sendLanding}
                        />
                    </div>
                    <div className='flex flex-col gap-1 items-center'>
                        <p className="text-sm text-secondary-400">Token Mint Address</p>
                        <div className='p-2 w-full gap-2 flex items-center text-white rounded-xl bg-secondary-300'>
                            <Image
                                src="/icons/avatar-image.png"
                                alt="avatar image"
                                width={32}
                                height={32}
                                className='object-cover object-center w-8 h-8'
                            />
                            <p className='truncate w-[90%]'>
                                {mintAddress?.toBase58() || wallet.publicKey?.toBase58()}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='text-secondary-400 text-sm font-normal'>
                            Create Market Fee
                        </div>
                        <div className='text-white font-semibold text-sm'>
                            2.7 SOL
                        </div>
                    </div>
                    <button
                        className="w-full py-3 px-6 text-[white] text-sm font-semibold text-center rounded-xl bg-primary-200 disabled:bg-gray-600"
                        onClick={handleCreateMarket}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Market'}
                    </button>
                </div>
            )}

            {step === 5 && (
                <div className="flex flex-col max-w-[480px] w-full bg-secondary-200 rounded-xl p-6 gap-6">
                    <div className='flex items-center justify-between'>
                        <div className='text-white text-2xl font-semibold'>
                            Add LP
                        </div>
                        <Image
                            src='/icons/x.svg'
                            alt='cross'
                            width={24}
                            height={24}
                            className='cursor-pointer'
                            onClick={sendLanding}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className="text-sm text-secondary-400">Wallet Address</p>
                        <div className='p-2 w-full gap-2 flex items-center text-white rounded-xl bg-secondary-300'>
                            <Image
                                src="/icons/avatar-image.png"
                                alt="avatar image"
                                width={32}
                                height={32}
                                className='object-cover object-center w-8 h-8'
                            />
                            <p className='truncate w-[90%] text-sm'>
                                {wallet.publicKey?.toBase58()}
                            </p>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-1'>
                        <p className="text-sm text-secondary-400">
                            Amount
                        </p>
                        <div className='w-full relative'>
                            <input
                                type="number"
                                className="w-full rounded-xl text-sm bg-secondary-500 py-3 px-4 placeholder:text-secondary-700 text-white focus:ring-0 focus:border-0 focus:outline-none"
                                onChange={(e) => handleSolBalanceChange(e.target.value)}
                                value={solBalance}
                            />
                            <p className='absolute right-4 top-[10px] text-secondary-700'>$sol</p>
                        </div>
                    </div>
                    <button
                        className="w-full py-3 px-6 text-[white] text-sm font-semibold text-center rounded-xl bg-primary-200 disabled:bg-gray-600"
                        onClick={clickAddLiquidity}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Liquidity'}
                    </button>
                </div>
            )}

            {step === 6 && (
                <div className="flex flex-col max-w-[480px] w-full bg-secondary-200 rounded-xl p-6 gap-6">
                    <div className='flex items-center justify-between'>
                        <div className='text-white text-2xl font-semibold'>
                            Burn
                        </div>
                        <Image
                            src='/icons/x.svg'
                            alt='cross'
                            width={24}
                            height={24}
                            className='cursor-pointer'
                            onClick={sendLanding}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className="text-sm text-secondary-400">Wallet Address</p>
                        <div className='p-2 w-full gap-2 flex items-center text-white rounded-xl bg-secondary-300'>
                            <Image
                                src="/icons/avatar-image.png"
                                alt="avatar image"
                                width={32}
                                height={32}
                                className='object-cover object-center w-8 h-8'
                            />
                            <p className='truncate w-[90%] text-sm'>
                                {wallet.publicKey?.toBase58()}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className="text-sm text-secondary-400">Token Info</p>
                        <div className='p-2 w-full gap-2 flex items-center text-white rounded-xl bg-secondary-300'>
                            <Image
                                src="/icons/Polygon_token.png"
                                alt="Polygon Token"
                                width={32}
                                height={32}
                                className='object-cover object-center w-8 h-8'
                            />
                            <div className='flex flex-col font-normal'>
                                <div className='text-sm'>
                                    {tokenSymbol} - {tokenName}
                                </div>
                                <div className='text-xs text-secondary-900'>
                                    <span>
                                        Decimal: {tokenDecimal}
                                    </span>
                                    &nbsp;&nbsp;&nbsp;
                                    <span>
                                        Token to Mint: {tokenBalance}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className="w-full py-3 px-6 text-[white] text-sm font-semibold text-center rounded-xl bg-primary-200 disabled:bg-gray-600"
                        onClick={clickBurnToken}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Burning...' : 'Burn It'}
                    </button>
                </div>
            )}

            {/* Snackbar for alerts */}
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({ ...alertState, open: false })}
            >
                <Alert
                    onClose={() => setAlertState({ ...alertState, open: false })}
                    severity={alertState.severity}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
        </div>
    );
}