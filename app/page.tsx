// ✅ Главный файл страницы (page.tsx)
'use client';

import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

// Данные по NFT
const nftList = [
  { id: 1, name: 'LABUBU LOL', price: 13, left: 23, total: 35, image: '/nft1.png' },
  { id: 2, name: 'NFT #2', price: 4, left: 10, total: 35, image: '/nft2.png' },
  // ...
];

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(pathname);
  const [tonConnectUI] = useTonConnectUI();
  const [showModal, setShowModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [ownedNFTs, setOwnedNFTs] = useState<number[]>([]);
  const [tgUser, setTgUser] = useState<any>(null);

  useEffect(() => {
    // Подтянуть данные пользователя из Telegram
    // @ts-ignore
    if (window?.Telegram?.WebApp?.initDataUnsafe?.user) {
      // @ts-ignore
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  const openModal = (nft: any) => {
    if (!tonConnectUI.account?.address) {
      alert('Connect wallet first!\nСначала подключите кошелёк.');
      return;
    }
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const handleBuy = () => {
    if (!selectedNFT) return;
    // здесь должна быть логика оплаты через TonConnect
    setOwnedNFTs([...ownedNFTs, selectedNFT.id]);
    setShowModal(false);
  };

  const tabs = [
    { id: '/', label: 'Home', icon: '/home.png' },
    { id: '/support', label: 'Support', icon: '/support.png' },
    { id: '/profile', label: 'Profile', icon: '/profile.png' }
  ];

  const renderTabs = () => (
    <div className="fixed bottom-0 w-full flex justify-around items-center h-14 bg-[#0f0017]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => router.push(tab.id)}
          className="flex flex-col items-center"
        >
          <Image
            src={tab.icon}
            alt={tab.label}
            width={40}
            height={40}
            className={pathname === tab.id ? 'opacity-100' : 'opacity-50'}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08000e] text-white pb-20">
      {/* Шапка */}
      <div className="flex justify-between items-center p-4 pt-6">
        <Image src="/logo.png" alt="logo" width={100} height={50} />
        {!tonConnectUI.connected && (
          <button
            onClick={() => tonConnectUI.openModal()}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Connect TON
          </button>
        )}
      </div>

      {/* Контент: Home */}
      {pathname === '/' && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">Trade NFTs</h2>
          <div className="grid grid-cols-2 gap-4">
            {nftList.filter(n => n.left > 0).map(nft => (
              <div
                key={nft.id}
                className="rounded-xl bg-[#14001f] p-2 flex flex-col items-center"
              >
                <Image
                  src={nft.image}
                  alt={nft.name}
                  width={150}
                  height={200}
                  className="rounded-lg"
                />
                <button
                  onClick={() => openModal(nft)}
                  className="mt-2 px-2 py-1 flex items-center justify-center bg-[#1a0029] rounded-full text-sm"
                >
                  <Image src="/ton-icon.png" alt="ton" width={16} height={16} className="mr-1" />
                  {nft.price}
                </button>
              </div>
            ))}
          </div>

          {/* Заглушка */}
          <p className="text-gray-400 text-sm text-center mt-6">
            More NFTs will be added soon.<br />Скоро будет добавлено больше NFT.
          </p>
        </div>
      )}

      {/* Support */}
      {pathname === '/support' && (
        <div className="px-4 pt-4">
          <h2 className="text-xl font-bold mb-4">Contact us</h2>
          <a href="https://t.me/SLOTNFTsupport_bot" className="block bg-blue-500 text-white text-center py-2 rounded mb-4">
            Write to Support
          </a>
          <h2 className="text-lg font-bold mb-2">SLOT NFT Channel</h2>
          <a href="https://t.me/SLOTNFTs" className="block bg-purple-700 text-white text-center py-2 rounded">
            Join Channel
          </a>
        </div>
      )}

      {/* Profile */}
      {pathname === '/profile' && (
        <div className="px-4 pt-4 flex flex-col items-center">
          <Image
            src={tgUser?.photo_url || '/profile.png'}
            alt="avatar"
            width={64}
            height={64}
            className="rounded-full mb-2"
          />
          <h2 className="text-lg font-semibold">{tgUser?.first_name || 'User'}</h2>
          <p className="text-gray-500 text-sm mb-4">@{tgUser?.username || 'username'}</p>
          <button
            onClick={() => tonConnectUI.openModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
          >
            Connect TON Wallet
          </button>

          {/* Купленные NFT */}
          {ownedNFTs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">
              Your NFTs will appear here.<br />Здесь появятся ваши NFT.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {nftList.filter(n => ownedNFTs.includes(n.id)).map(nft => (
                <Image
                  key={nft.id}
                  src={nft.image}
                  alt={nft.name}
                  width={150}
                  height={200}
                  className="rounded-xl"
                />
              ))}
            </div>
          )}

          <button
            onClick={() => alert('Selling NFTs will be available soon.')}
            className="mt-6 px-4 py-2 bg-purple-700 text-white rounded"
          >
            Sell NFT
          </button>
        </div>
      )}

      {renderTabs()}

      {/* Модалка покупки */}
      {showModal && selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#10001a] rounded-2xl p-6 w-4/5">
            <div className="flex gap-4">
              <Image src={selectedNFT.image} alt="nft" width={80} height={100} />
              <div>
                <h3 className="text-white font-bold text-lg">{selectedNFT.name}</h3>
                <p className="text-sm text-gray-400">{selectedNFT.left}/{selectedNFT.total} available</p>
                <p className="text-white font-bold mt-1">{selectedNFT.price} TON</p>
              </div>
            </div>
            <p className="text-center text-white text-sm mt-4">
              Are you sure you want buy this NFT?<br />Вы уверены, что хотите купить этот NFT?
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                className="bg-white text-black px-4 py-2 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
