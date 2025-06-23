'use client'

import { useState } from 'react';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

export default function Page() {
  const [tab, setTab] = useState<'home' | 'support' | 'profile'>('home');
  const userWallet = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  // NFT MOCK DATA (можете заменить на реальные данные)
  const nftList = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    image: `/nft${(i % 4) + 1}.png`, // заглушки типа /nft1.png и т.д.
    price: 4,
  }));

  return (
    <div className="min-h-screen pb-20 bg-gray-900 text-white">
      {/* Логотип */}
      {tab === 'home' && (
        <div className="p-4">
          <img src="/logo.png" alt="logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold mt-4">Trade NFTs</h1>

          {/* Сетка NFT */}
          <div className="grid grid-cols-2 gap-4 mt-4 overflow-y-auto">
            {nftList.map((nft) => (
              <div key={nft.id} className="bg-gray-800 rounded-xl p-2">
                <img src={nft.image} alt="nft" className="rounded mb-2" />
                <div className="flex items-center justify-center gap-1 text-blue-300">
                  <img
                    src="https://cryptologos.cc/logos/the-open-network-ton-logo.png"
                    alt="ton"
                    className="w-4 h-4"
                  />
                  {nft.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUPPORT вкладка */}
      {tab === 'support' && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Contact us</h2>
          <a
            href="https://t.me/SLOTNFTsupport_bot"
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-white font-semibold"
          >
            Write to Support
          </a>
        </div>
      )}

      {/* PROFILE вкладка */}
      {tab === 'profile' && (
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-bold">User</h3>
              <p className="text-sm text-gray-400">{userWallet ? userWallet.slice(0, 12) + '...' : 'Not connected'}</p>
            </div>
          </div>

          <TonConnectButton />

          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Your NFTs</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Здесь должны быть только купленные NFT */}
              <img src="/nft1.png" alt="nft" className="rounded" />
            </div>
          </div>
        </div>
      )}

      {/* Нижняя навигация */}
      <div className="fixed bottom-0 left-0 w-full flex justify-around bg-gray-800 text-white py-2 border-t border-gray-700">
        <button onClick={() => setTab('home')} className={tab === 'home' ? 'text-blue-400' : ''}>🏠</button>
        <button onClick={() => setTab('support')} className={tab === 'support' ? 'text-blue-400' : ''}>📞</button>
        <button onClick={() => setTab('profile')} className={tab === 'profile' ? 'text-blue-400' : ''}>👤</button>
      </div>
    </div>
  );
}
