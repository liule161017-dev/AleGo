'use client'
import { useState, useEffect } from 'react';
interface ProductInfoProps {
  onOpenPay: () => void; // 新增 prop 接收开关函数
}
import { useRouter } from 'next/navigation';

export default function ProductInfo({ onOpenPay }: ProductInfoProps) {
  const [qty, setQty] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  // 初始化收藏状态 (你可以根据真实 productId 来判断)
  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem('aletoys_favs') || '{}');
    if (savedFavs['032']) setIsSaved(true);
  }, []);

  const handleSave = () => {
    const savedFavs = JSON.parse(localStorage.getItem('aletoys_favs') || '{}');
    if (isSaved) delete savedFavs['032'];
    else savedFavs['032'] = true;
    localStorage.setItem('aletoys_favs', JSON.stringify(savedFavs));
    setIsSaved(!isSaved);
  };

// 修改 handleBuy 函数：
const handleBuy = () => {
  // 假设当前商品 ID 是 032
  router.push('/checkout/032'); 
};

  return (
    <aside className="bg-gradient-to-b from-white/[0.02] to-transparent p-6 rounded-2xl border border-white/5 relative">
      <h1 className="text-2xl font-extrabold text-white mb-2">Kitsune Artisan — No.032</h1>
      <p className="text-gray-400 text-sm mb-4">By Y. Nakamoto — limited edition of 250</p>

      <div className="flex gap-2 mb-6">
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-xs text-gray-400">Grade: <strong className="text-white ml-1">Collector</strong></span>
        <span className="bg-white/5 px-3 py-1.5 rounded-lg text-xs text-gray-400">Status: <strong className="text-[#00e0c6] ml-1">In Stock</strong></span>
      </div>

      <div className="flex items-baseline gap-4 mb-4">
        <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6]">${499}</span>
        <span className="text-sm text-gray-500 line-through">$650</span>
      </div>

      {/* 购买与收藏按钮 */}
      <div className="flex gap-3 mt-6">
        <button onClick={handleSave} className={`save-icon w-14 h-14 rounded-xl border flex items-center justify-center ${isSaved ? 'active' : 'border-white/5'}`}>
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12.1 21s-7.3-4.9-9.2-8.2a5.9 5.9 0 010-5.9C3.8 4.7 6.4 3 8.7 4.2 9.9 4.9 11.3 6.2 12.1 7.7c.8-1.5 2.2-2.8 3.4-3.5C17.6 3 20.2 4.7 21 7.2a5.9 5.9 0 010 5.9C19.4 16.1 12.1 21 12.1 21z"/></svg>
        </button>
        <button onClick={handleBuy} className="flex-1 btn-gradient rounded-xl font-extrabold text-lg flex items-center justify-center gap-2">
          Buy Now
        </button>
      </div>

      {/* 数量与库存提示 */}
      <div className="flex items-center gap-4 mt-6">
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10">−</button>
          <span className="w-6 text-center text-sm font-bold">{qty}</span>
          <button onClick={() => setQty(Math.min(3, qty + 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10">+</button>
        </div>
        <div className="text-xs text-gray-400">Max available: <strong className="text-white">3</strong></div>
      </div>

      <hr className="border-white/5 my-6" />

      <div className="text-xs text-gray-400 leading-relaxed space-y-3">
        <p>Ships from: <strong className="text-gray-200">Global Warehouse</strong> • Est. delivery: <strong className="text-gray-200">3–7 business days</strong>.</p>
        <p>Worldwide shipping • Certificate of authenticity included • Bespoke packaging available on request.</p>
      </div>
    </aside>
  );
}