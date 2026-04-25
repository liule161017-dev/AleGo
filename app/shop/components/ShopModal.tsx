// app/shop/components/ShopModal.tsx
'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../data';

interface ModalProps {
  product: Product | null;
  onClose: () => void;
  isFav: boolean;
  onToggleFav: (id: number) => void;
}

export default function ShopModal({ product, onClose, isFav, onToggleFav }: ModalProps) {
  if (!product) return null;
  const router = useRouter(); // <-- 初始化路由实例
  // 自定义跳转逻辑函数
  const handleOpenDetails = () => {
    onClose(); // 先关闭当前弹窗
    router.push(`/product/${product.id}`); // 然后丝滑跳转到详情页
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-4xl bg-gradient-to-b from-[#081017] to-[#0b0d10] rounded-2xl p-5 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 relative" onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 text-xl">✕</button>

        <div className="relative h-[300px] md:h-[420px] rounded-xl overflow-hidden bg-black">
          <Image src={product.img} alt={product.title} fill className="object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-2">{product.title}</h2>
          <div className="text-gray-400 text-sm mb-4">{product.sku} · {product.artist} · {product.availability}</div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl font-extrabold text-[#ff6b9a]">${product.price}</div>
            <div className="px-3 py-1 rounded-lg border border-white/5 text-gray-400 text-xs font-bold">{product.edition}</div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Limited resin statue. Hand-painted finish. Edition: {product.edition}. Release date: {new Date(product.release).toLocaleDateString()}. Highly detailed craftsmanship. Recommended for collectors aged 15+.
          </p>

          <div className="flex gap-3">
            <button onClick={() => onToggleFav(product.id)} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b9a] to-[#6ee7f2] text-[#07121a] font-bold">
              {isFav ? 'Saved' : 'Save'}
            </button>
            <button onClick={handleOpenDetails} className="px-6 py-2.5 rounded-xl bg-transparent border border-white/10 text-gray-400 font-bold hover:bg-white/5">
              Open product page
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}