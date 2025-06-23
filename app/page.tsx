'use client'

import { useState, useEffect } from 'react';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

export default function Page() {
  const [tab, setTab] = useState<'home' | 'support' | 'profile'>('home');
  const userWallet = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [purchasedNFTs, setPurchasedNFTs] = useState<number[]>([]);

  const handleBuy = async (nftId: number) => {
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: 'UQBELu8ybArzO3GlF6zdEfPnrjAymVkAAhJGL5m9xHDWyL2R',
            amount: (4 * 1e9).toString(),
          },
        ],
      });
      setPurchasedNFTs([...purchasedNFTs, nftId]);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const nftList = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    image: `/nft${i + 1}.png`,
    price: 4,
  }));

  return (
    <div className="min-h-screen pb-24 bg-[#08000e] text-white">
      {/* Логотип */}
      <div className="absolute top-4 left-4">
        <img src="/logo.png" alt="logo" className="w-[250px] h-[125px] object-contain" />
      </div>

      {tab === 'home' && (
        <div className="pt-36 px-4">
          <h1 className="text-2xl font-bold mb-6">Trade NFTs</h1>
          <div className="grid grid-cols-2 gap-4">
            {nftList.map((nft) => (
              <div key={nft.id} className="bg-[#120019] rounded-xl p-2 flex flex-col items-center">
                <img src={nft.image} alt="nft" className="rounded-lg mb-2 w-full h-36 object-cover" />
                <button
                  onClick={() => handleBuy(nft.id)}
                  className="bg-[#1d001f] px-4 py-1 rounded-md flex items-center justify-center gap-2 text-sm mt-auto mb-1"
                >
                  <img
                    src="https://cryptologos.cc/logos/the-open-network-ton-logo.png"
                    alt="TON"
                    className="w-4 h-4"
                  />
                  {nft.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'support' && (
        <div className="pt-36 px-6">
          <h2 className="text-xl font-bold mb-4">Contact us</h2>
          <a
            href="https://t.me/SLOTNFTsupport_bot"
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-white font-semibold block mb-4"
          >
            Write to Support
          </a>
          <h3 className="text-md font-bold mb-2">SLOT NFT Channel</h3>
          <a
            href="https://t.me/SLOTNFTs"
            target="_blank"
            rel="noreferrer"
            className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded text-white font-semibold block"
          >
            Join Channel
          </a>
        </div>
      )}

      {tab === 'profile' && (
        <div className="pt-36 px-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="avatar"
              className="w-14 h-14 rounded-full"
            />
            <div>
              <h3 className="text-lg font-bold">{userWallet ? userWallet.slice(0, 6) + '...' + userWallet.slice(-4) : 'User'}</h3>
              <p className="text-sm text-gray-400">{userWallet ? 'Connected' : 'Not connected'}</p>
            </div>
          </div>

          <TonConnectButton />

          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Your NFTs</h4>
            <div className="grid grid-cols-2 gap-4">
              {purchasedNFTs.map((id) => (
                <img key={id} src={`/nft${id + 1}.png`} alt="nft" className="rounded w-full h-36 object-cover" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Нижняя навигация */}
      <div className="fixed bottom-3 left-0 w-full flex justify-around bg-[#12001f] text-white py-3 border-t border-[#2c1b3a]">
        <button onClick={() => setTab('home')}>
          <img src="/icons/home.png" alt="Home" className="w-10 h-10" />
        </button>
        <button onClick={() => setTab('support')}>
          <img src="/icons/support.png" alt="Support" className="w-10 h-10" />
        </button>
        <button onClick={() => setTab('profile')}>
          <img src="/icons/profile.png" alt="Profile" className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
