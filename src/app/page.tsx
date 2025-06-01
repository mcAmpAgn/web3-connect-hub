'use client';
import { useState, Suspense } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';

// Dynamically import heavy components to improve loading speed
const LandingHeader = dynamic(() => import('@/components/LandingHeader/LandingHeader'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-800 animate-pulse"></div>
});

const HotTokens = dynamic(() => import('@/components/HotTokens/HotTokens'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-700 animate-pulse rounded-lg m-6"></div>
});

const DiscoverTokens = dynamic(() => import('@/components/DiscoverTokens/DiscoverTokens'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-700 animate-pulse rounded-lg m-6"></div>
});

const Banner = dynamic(() => import('@/components/Banner/Banner'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-700 animate-pulse"></div>
});

const Footer = dynamic(() => import('@/components/Footer/Footer'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-800 animate-pulse"></div>
});

export default function HomePage() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenLogo, setTokenLogo] = useState<File | null>();
  const [tokenDecimal, setTokenDecimal] = useState(9);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic token creation with lazy loading of heavy packages
  const handleCreateToken = async () => {
    if (!tokenName || !tokenSymbol || !tokenLogo || !tokenBalance) {
      alert("Please fill all required fields");
      return;
    }

    if (!wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);

    try {
      // Dynamic import of heavy packages only when needed
      const [
        { toMetaplexFileFromBrowser },
        { createSPLToken }
      ] = await Promise.all([
        import('@metaplex-foundation/js'),
        import('@/contexts/createSPLToken')
      ]);

      const _file = await toMetaplexFileFromBrowser(tokenLogo);
      await createSPLToken.createSPLToken(
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
      
      alert("Token created successfully!");
    } catch (error) {
      console.error("Token creation error:", error);
      alert("Failed to create token. Please try again.");
    } finally {
      setIsLoading(false);
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
    } else {
      setTokenLogo(null);
    }
  };

  const handleDecimalChange = (value: string) => {
    setTokenDecimal(parseInt(value));
  };

  const handleBalanceChange = (value: string) => {
    setTokenBalance(parseInt(value));
  };

  return (
    <main className='w-full min-w-[100vw] h-full min-h-screen bg-secondary-300'>
      <Suspense fallback={<div className="h-20 bg-gray-800 animate-pulse"></div>}>
        <LandingHeader />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-700 animate-pulse rounded-lg m-6"></div>}>
        <HotTokens />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-700 animate-pulse rounded-lg m-6"></div>}>
        <DiscoverTokens />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 bg-gray-700 animate-pulse"></div>}>
        <Banner />
      </Suspense>
      
      <Suspense fallback={<div className="h-64 bg-gray-800 animate-pulse"></div>}>
        <Footer />
      </Suspense>

      {/* Optional: Uncomment this section if you want a simple token creation form on the homepage */}
      {/* 
      <div className="bg-slate-900 w-full">
        <div className="w-2/5 py-32 m-auto">
          <div>
            <p className="text-lg text-white font-medium my-2">Name: </p>
            <input 
              className="w-full bg-transparent border-2 rounded-3xl text-lg py-2 px-4 text-cyan-100" 
              onChange={(e) => handleNameChange(e.target.value)}
              value={tokenName}
            />
          </div>
          
          <div>
            <p className="text-lg text-white font-medium my-2">Symbol: </p>
            <input 
              className="w-full bg-transparent border-2 rounded-3xl text-lg py-2 px-4 text-cyan-100"
              onChange={(e) => handleSymbolChange(e.target.value)}
              value={tokenSymbol}
            />
          </div>
          
          <div>
            <p className="text-lg text-white font-medium my-2">Token Logo: </p>
            <input 
              type="file" 
              className="w-full bg-transparent border-2 rounded-3xl text-lg py-2 px-4 text-cyan-100" 
              accept='image/png, image/jpeg'
              onChange={(e) => handleLogoFileChange(e.target.files)}
            />
          </div>

          <div>
            <p className="text-lg text-white font-medium my-2">Decimals: </p>
            <input
              type="number"
              className="w-full bg-transparent border-2 rounded-3xl text-lg py-2 px-4 text-cyan-100"
              onChange={(e) => handleDecimalChange(e.target.value)}
              value={tokenDecimal}
            />
          </div>
          
          <div>
            <p className="text-lg text-white font-medium my-2">
              Tokens to Mint:{" "}
            </p>
            <input
              type="number"
              className="w-full bg-transparent border-2 rounded-3xl text-lg py-2 px-4 text-cyan-100"
              onChange={(e) => handleBalanceChange(e.target.value)}
              value={tokenBalance}
            />
          </div>
          
          <div className="mt-8">
            <button 
              className="block w-[250px] py-4 px-8 rounded-3xl text-black text-xl font-bold bg-green-400 m-auto disabled:bg-gray-400"
              onClick={handleCreateToken}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Token'}
            </button>
          </div>
        </div>
      </div>
      */}
    </main>
  );
}