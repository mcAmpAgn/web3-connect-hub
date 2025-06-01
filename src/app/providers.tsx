"use client";
import React, { ReactNode } from "react";
import { PageProvider } from "@/contexts/PageContext";
import { ShowSideBarProvider } from "@/contexts/showSideBarContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletProvider";

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
