// src/app/providers.tsx - Remove react-query dependency
"use client";
import React, { ReactNode } from "react";
import { PageProvider } from "@/contexts/PageContext";
import { ShowSideBarProvider } from "@/contexts/showSideBarContext";
import dynamic from "next/dynamic";

// Dynamically load Solana wallet provider to reduce initial bundle
const SolanaWalletProvider = dynamic(() => 
  import("@/contexts/SolanaWalletProvider").then(mod => ({ default: mod.SolanaWalletProvider })), 
  { 
    ssr: false,
    loading: () => <div className="min-h-screen bg-gray-900 animate-pulse"></div>
  }
);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ShowSideBarProvider>
      <PageProvider>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </PageProvider>
    </ShowSideBarProvider>
  );
}