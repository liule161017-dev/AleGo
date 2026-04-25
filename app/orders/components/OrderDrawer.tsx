// app/orders/components/OrderDrawer.tsx
'use client'
import { X, Package, Clock, MapPin, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { RealOrder } from '../page'; // 确保这里导入了我们在 page.tsx 定义的类型

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: RealOrder | null;
}

export default function OrderDrawer({ isOpen, onClose, order }: OrderDrawerProps) {
  // 【核心修复 1】: 如果 order 为空或未打开，直接返回 null，防止读取属性报错
  if (!order || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* 抽屉主体 */}
      <div className="relative w-full max-w-lg bg-[#0f1113] border-l border-white/10 h-full shadow-2xl animate-in slide-in-from-right duration-500">
        {/* 头部 */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0b0c]">
          <div>
            <h2 className="text-xl font-bold text-white font-serif">Order Details</h2>
            <p className="text-xs text-gray-500 mt-1 font-mono">#{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-140px)] p-6 space-y-8 custom-scrollbar">
          {/* 状态追踪 */}
          <section className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Status</h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                order.status === 'pending_review' ? 'bg-[#ff4fa6]/10 text-[#ff4fa6]' : 'bg-[#00edce]/10 text-[#00edce]'
              }`}>
                {order.status === 'pending_review' ? <Clock size={20} /> : <Package size={20} />}
              </div>
              <div>
                <div className="font-bold text-white capitalize">{order.status.replace('_', ' ')}</div>
                <p className="text-xs text-gray-500">
                  {order.status === 'pending_review' ? 'Verifying your transfer...' : 'Preparing for dispatch.'}
                </p>
              </div>
            </div>
          </section>

          {/* 商品清单 */}
          <section className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Items</h3>
            <div className="space-y-3">
              {order.order_items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-[#0a0b0c]">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.products.images?.[0]} alt="Product" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{item.products.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.products.edition} Edition</div>
                    <div className="text-xs text-[#00edce] font-bold mt-1">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right font-black text-white">
                    ${item.price_at_purchase.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 费用总结 */}
          <section className="pt-4 border-t border-white/5 space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Investment</span>
              {/* 【核心修复 2】: 使用 total_amount 替换之前的 price 字段 */}
              <span className="text-2xl font-black text-white">
                ${order.total_amount ? order.total_amount.toLocaleString() : '0.00'}
              </span>
            </div>
          </section>
        </div>
        
        {/* 底部操作 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-[#0a0b0c]/80 backdrop-blur-md">
           <button 
             onClick={() => window.open('https://wa.me/YOUR_NUMBER', '_blank')}
             className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[#ff4fa6] to-[#00edce] text-black uppercase tracking-widest shadow-lg"
           >
             Contact Artisan
           </button>
        </div>
      </div>
    </div>
  );
}