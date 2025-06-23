'use client'

import { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from "@ton/core";

export default function Home() {
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleWalletConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    console.log("Wallet connected successfully!");
    setIsLoading(false);
  }, []);

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log("Wallet disconnected successfully!");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account?.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      setIsLoading(true);
      await tonConnectUI.disconnect();
    } else {
      await tonConnectUI.openModal();
    }
  };

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">TON Connect Demo</h1>
      {tonWalletAddress ? (
        <div className="flex flex-col items-center">
          <p className="mb-4">Connected: {formatAddress(tonWalletAddress)}</p>
          <button
            onClick={handleWalletAction}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
     <button
  onClick={async () => {
    if (!tonConnectUI.connected || !tonWalletAddress) {
      alert("Сначала подключите кошелёк");
      return;
    }

    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: 'UQBELu8ybArzO3GlF6zdEfPnrjAymVkAAhJGL5m9xHDWyL2R', // ← замените на ваш адрес!
          amount: (2 * 1e9).toString(), // 2 TON в нанотонах
        },
      ],
    });
  }}
  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
>
  Купить NFT за 2 TON
</button>
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

export default function Home() {
  const [tonConnectUI] = useTonConnectUI();
  const userWallet = useTonAddress();

  const handleBuy = () => {
    if (!userWallet) {
      alert("Сначала подключите TON-кошелёк.");
      return;
    }

    tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: 'EQВАШ_WALLET_АДРЕС', // ← замените на свой адрес
          amount: (2 * 1e9).toString(), // 2 TON в нанотонах
        },
      ],
    });
  };

  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>🎨 NFT Площадка</h1>

      <TonConnectButton />

      <div style={{
        background: "#1e1e1e",
        borderRadius: "12px",
        padding: "15px",
        marginTop: "30px",
        display: "inline-block",
        maxWidth: "320px"
      }}>
        <img
          src="https://via.placeholder.com/300"
          alt="NFT"
          style={{ width: "100%", borderRadius: "10px" }}
        />

        <button
          onClick={handleBuy}
          style={{
            background: "#00aaff",
            border: "none",
            color: "white",
            padding: "12px 16px",
            marginTop: "10px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <img
            src="https://cryptologos.cc/logos/the-open-network-ton-logo.png"
            alt="TON"
            width="20"
            height="20"
            style={{ borderRadius: "50%" }}
          />
          Купить за 2 TON
        </button>
      </div>
    </main>
  );
}
