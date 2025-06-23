'use client';

import { useEffect, useState } from 'react';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';

export default function Page() {
  const [tab, setTab] = useState<'home' | 'support' | 'profile'>('home');
  const [tonConnectUI] = useTonConnectUI();
  const [wallet, setWallet] = useState<string>('');
  const [user, setUser] = useState<{ name: string; photo_url: string } | null>(null);
  const [purchasedNFTs, setPurchasedNFTs] = useState<number[]>([]);
  const [error, setError] = useState<string>('');

  const nftList = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    image: `/nft${i + 1}.png`,
    price: 4,
  }));

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    tg?.ready();
    const u = tg?.initDataUnsafe?.user;
    if (u) {
      setUser({
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
        photo_url: u.photo_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      });
    }
    if (tonConnectUI.account?.address) {
      setWallet(tonConnectUI.account.address);
    }
  }, [tonConnectUI]);

  const handleBuy = async (nftId: number) => {
    if (!tonConnectUI.account?.address) {
      setError('Please connect your TON wallet first.\nПожалуйста, сначала подключите TON-кошелёк.');
      return;
    }
    setError('');
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
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-[#08000e] text-white relative">
      <div className="absolute top-4 left-4">
        <img src="/logo.png" alt="logo" className="w-[250px] h-[125px] object-contain" />
      </div>

      {tab === 'home' && (
        <div className="pt-36 px-4">
          <h1 className="text-2xl font-bold mb-6">Trade NFTs</h1>
          {error && (
            <div className="bg-red-600 text-white p-2 rounded mb-4 text-center whitespace-pre-line">
              {error}
            </div>
          )}
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
          <p className="text-gray-400 text-center text-sm mt-6">
            More NFTs coming soon.<br />Скоро будет добавлено больше NFT.
          </p>
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
              src={user?.photo_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              alt="avatar"
              className="w-14 h-14 rounded-full"
            />
            <div>
              <h3 className="text-lg font-bold">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-400">{wallet ? 'Connected' : 'Not connected'}</p>
            </div>
          </div>

          <TonConnectButton />

          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Your NFTs</h4>
            {purchasedNFTs.length === 0 ? (
              <p className="text-center text-sm text-gray-400">
                Your NFTs will appear here.<br />Здесь появятся ваши NFT.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {purchasedNFTs.map((id) => (
                  <img key={id} src={`/nft${id + 1}.png`} alt="nft" className="rounded w-full h-36 object-cover" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full flex justify-around bg-[#12001f] text-white py-5 border-t-2 border-[#2c1b3a] z-50">
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
