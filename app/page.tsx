// === 1. app/page.tsx ===
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
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

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<'home' | 'support' | 'profile'>('home');
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [ownedNfts, setOwnedNfts] = useState<Nft[]>([]);
  const [buyingNft, setBuyingNft] = useState<Nft | null>(null);

  const handleBuyClick = (nft: Nft) => {
    if (!wallet) {
      alert('Please connect your TON wallet.\n\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043A\u043E\u0448\u0435\u043B\u0435\u043A TON.');
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
    setOwnedNfts((prev) => [...prev, buyingNft]);
    setBuyingNft(null);
  };

  const visibleNfts = nfts.filter((nft) => nft.available > 0);

  return (
    <div className="bg-[#08000e] text-white min-h-screen p-4">
      <div className="flex items-center justify-between">
        <Image src="/logo.png" alt="Logo" width={200} height={100} className="ml-2 mt-2" />
        <TonConnectButton />
      </div>

      {selectedTab === 'home' && (
        <div>
          <h1 className="text-2xl font-bold mt-2">Trade NFTs</h1>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {visibleNfts.map((nft) => (
              <div key={nft.id} className="bg-transparent p-2 relative">
                <Image src={nft.image} alt={nft.name} width={400} height={540} className="rounded-xl" />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center bg-[#1c001f] px-3 py-1 rounded-full">
                  <Image src="/ton-icon.png" alt="TON" width={20} height={20} />
                  <span className="ml-1 text-base">{nft.price}</span>
                </div>
                <button onClick={() => handleBuyClick(nft)} className="mt-2 w-full bg-purple-800 py-2 rounded-lg text-sm">Buy</button>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            More NFTs coming soon.<br />Скоро будет добавлено больше NFT.
          </p>
        </div>
      )}

      {selectedTab === 'support' && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <a href="https://t.me/SLOTNFTsupport_bot" target="_blank" rel="noreferrer" className="block bg-blue-600 py-2 rounded mb-2">Write to Support</a>
          <a href="https://t.me/SLOTNFTs" target="_blank" rel="noreferrer" className="block bg-purple-700 py-2 rounded">Join SLOT NFT Channel</a>
        </div>
      )}

      {selectedTab === 'profile' && (
        <div className="mt-6 text-center">
          <Image src="/logo.png" alt="Avatar" width={80} height={80} className="mx-auto rounded-full" />
          <h2 className="text-xl font-semibold mt-2">NFT Trader</h2>
          <p className="text-sm text-gray-400">{wallet?.account.address.slice(0, 6)}...{wallet?.account.address.slice(-4)}</p>

          <TonConnectButton />
          <h3 className="text-lg font-bold mt-6">Your NFTs</h3>
          {ownedNfts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {ownedNfts.map((nft) => (
                <Image key={nft.id} src={nft.image} alt={nft.name} width={400} height={540} className="rounded-xl" />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm mt-6">
              Your NFTs will appear here.<br />Здесь появятся ваши NFT.
            </p>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-[#120018] py-4 flex justify-around items-center">
        <Image src="/home.png" alt="Home" width={40} height={40} onClick={() => setSelectedTab('home')} className={selectedTab === 'home' ? 'opacity-100' : 'opacity-50'} />
        <Image src="/support.png" alt="Support" width={40} height={40} onClick={() => setSelectedTab('support')} className={selectedTab === 'support' ? 'opacity-100' : 'opacity-50'} />
        <Image src="/profile.png" alt="Profile" width={40} height={40} onClick={() => setSelectedTab('profile')} className={selectedTab === 'profile' ? 'opacity-100' : 'opacity-50'} />
      </div>

      {buyingNft && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#120018] p-4 rounded-3xl w-[90%] max-w-xs text-center">
            <Image src={buyingNft.image} alt={buyingNft.name} width={100} height={100} className="mx-auto rounded-xl" />
            <h2 className="text-lg font-bold mt-2">{buyingNft.name}</h2>
            <p className="text-sm text-gray-400">{buyingNft.available}/{buyingNft.total} available</p>
            <p className="text-lg mt-1">{buyingNft.price} TON</p>
            <p className="text-sm mt-4">Are you sure you want to buy this NFT?<br />Вы уверены, что хотите купить этот NFT?</p>
            <div className="mt-4 flex justify-between">
              <button className="bg-gray-700 px-4 py-1 rounded-full" onClick={() => setBuyingNft(null)}>Cancel</button>
              <button className="bg-white text-black px-4 py-1 rounded-full" onClick={confirmPurchase}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
