// types.ts
export type Nft = {
  id: string;
  name: string;
  image: string;
  price: number;
  available: number;
  total: number;
};

// page.tsx
'use client';

import React, { useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import { useTonConnectUI, useTonWallet, TonConnectButton } from '@tonconnect/ui-react';
import { Nft } from './types';

const nfts: Nft[] = [
  {
    id: '1',
    name: 'LABUBU LOL',
    image: '/nft1.png',
    price: 13,
    available: 23,
    total: 35,
  },
  {
    id: '2',
    name: 'PINK GHOST',
    image: '/nft2.png',
    price: 4,
    available: 0,
    total: 35,
  },
];

const Page: NextPage = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [selectedTab, setSelectedTab] = useState<'home' | 'support' | 'profile'>('home');
  const [ownedNfts, setOwnedNfts] = useState<Nft[]>([]);
  const [buyingNft, setBuyingNft] = useState<Nft | null>(null);

  const handleBuyClick = (nft: Nft) => {
    if (!wallet) {
      alert('Please connect your TON wallet.\nПожалуйста, подключите кошелек TON.');
      return;
    }
    setBuyingNft(nft);
  };

  const confirmPurchase = () => {
    if (!buyingNft) return;
    tonConnectUI.sendTransaction({
      messages: [
        {
          address: 'UQBELu8ybArzO3GlF6zdEfPnrjAymVkAAhJGL5m9xHDWyL2R',
          amount: (buyingNft.price * 1_000_000_000).toString(),
        },
      ],
    });
    setOwnedNfts((prev: Nft[]) => [...prev, buyingNft]);
    setBuyingNft(null);
  };

  const visibleNfts = nfts.filter((nft) => nft.available > 0);

  return (
    <div className="bg-[#08000e] text-white min-h-screen pb-24 p-4">
      <div className="flex items-center justify-between">
        <Image src="/logo.png" alt="Logo" width={300} height={150} className="ml-4 mt-4" />
        <TonConnectButton />
      </div>

      {selectedTab === 'home' && (
        <div>
          <h1 className="text-3xl font-bold mt-4">Trade NFTs</h1>
          <div className="grid grid-cols-2 gap-6 mt-6">
            {visibleNfts.map((nft) => (
              <div key={nft.id} className="p-2 relative">
                <Image src={nft.image} alt={nft.name} width={800} height={1200} className="rounded-xl" />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-[#1c001f] px-4 py-1 rounded-full">
                  <Image src="/ton-icon.png" alt="TON" width={24} height={24} />
                  <span className="ml-2 text-lg">{nft.price}</span>
                </div>
                <button onClick={() => handleBuyClick(nft)} className="mt-3 w-full bg-purple-800 py-3 rounded-xl text-base font-semibold">Buy</button>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-10">
            More NFTs coming soon.<br />Скоро будет добавлено больше NFT.
          </p>
        </div>
      )}

      {selectedTab === 'support' && (
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold mb-5">Contact Us</h2>
          <a href="https://t.me/SLOTNFTsupport_bot" target="_blank" rel="noreferrer" className="block bg-blue-600 py-3 rounded mb-3 text-lg font-medium">Write to Support</a>
          <a href="https://t.me/SLOTNFTs" target="_blank" rel="noreferrer" className="block bg-purple-700 py-3 rounded text-lg font-medium">Join SLOT NFT Channel</a>
        </div>
      )}

      {selectedTab === 'profile' && (
        <div className="mt-8 text-center">
          <Image src="/logo.png" alt="Avatar" width={100} height={100} className="mx-auto rounded-full" />
          <h2 className="text-2xl font-semibold mt-4">NFT Trader</h2>
          <p className="text-sm text-gray-400 mt-1">
            {wallet?.account?.address ? `${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}` : 'No Wallet Connected'}
          </p>

          <TonConnectButton />
          <h3 className="text-xl font-bold mt-8">Your NFTs</h3>
          {ownedNfts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-6">
              {ownedNfts.map((nft) => (
                <Image key={nft.id} src={nft.image} alt={nft.name} width={800} height={1200} className="rounded-xl" />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm mt-6">
              Your NFTs will appear here.<br />Здесь появятся ваши NFT.
            </p>
          )}
          <button className="mt-6 bg-gray-600 px-6 py-2 rounded-xl" onClick={() => alert('NFT selling feature coming soon!\nФункция продажи скоро будет доступна.')}>Sell NFT</button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-[#120018] py-5 flex justify-around items-center border-t border-[#1f0f2a]">
        <Image src="/home.png" alt="Home" width={60} height={60} onClick={() => setSelectedTab('home')} className={selectedTab === 'home' ? 'opacity-100' : 'opacity-50'} />
        <Image src="/support.png" alt="Support" width={60} height={60} onClick={() => setSelectedTab('support')} className={selectedTab === 'support' ? 'opacity-100' : 'opacity-50'} />
        <Image src="/profile.png" alt="Profile" width={60} height={60} onClick={() => setSelectedTab('profile')} className={selectedTab === 'profile' ? 'opacity-100' : 'opacity-50'} />
      </div>

      {buyingNft && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#120018] p-6 rounded-3xl w-[90%] max-w-sm text-center">
            <Image src={buyingNft.image} alt={buyingNft.name} width={300} height={300} className="mx-auto rounded-xl" />
            <h2 className="text-2xl font-bold mt-4">{buyingNft.name}</h2>
            <p className="text-sm text-gray-400 mt-2">{buyingNft.available}/{buyingNft.total} available</p>
            <p className="text-lg mt-2">{buyingNft.price} TON</p>
            <p className="text-sm mt-6">Are you sure you want to buy this NFT?<br />Вы уверены, что хотите купить этот NFT?</p>
            <div className="mt-6 flex justify-between">
              <button className="bg-gray-700 px-6 py-2 rounded-full" onClick={() => setBuyingNft(null)}>Cancel</button>
              <button className="bg-white text-black px-6 py-2 rounded-full" onClick={confirmPurchase}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
npm run build
