'use client'
import { useState } from 'react';
import Image from 'next/image';
import { X, CheckCircle, Smartphone, Send } from 'lucide-react';
import { FaWeixin, FaAlipay } from 'react-icons/fa';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    price: number | string;
    img: string;
  } | null;
}

export default function PaymentModal({ isOpen, onClose, product }: PaymentModalProps) {
  const [method, setMethod] = useState<'wechat' | 'alipay'>('wechat');

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-[#0f1518] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {/* 顶部：订单信息 */}
        <div className="p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Secure Checkout</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
              <Image src={product.img} alt={product.title} fill className="object-cover" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{product.title}</div>
              <div className="text-lg font-black text-[#00e0c6]">${product.price} USD</div>
            </div>
          </div>
        </div>

        {/* 中间：支付切换与二维码 */}
        <div className="p-8 flex flex-col items-center">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setMethod('wechat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${method === 'wechat' ? 'bg-[#09B83E]/10 border-[#09B83E] text-[#09B83E]' : 'border-white/5 text-gray-500'}`}
            >
              <FaWeixin size={20} /> <span className="font-bold text-sm">WeChat Pay</span>
            </button>
            <button 
              onClick={() => setMethod('alipay')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${method === 'alipay' ? 'bg-[#00A3EE]/10 border-[#00A3EE] text-[#00A3EE]' : 'border-white/5 text-gray-500'}`}
            >
              <FaAlipay size={20} /> <span className="font-bold text-sm">Alipay</span>
            </button>
          </div>

          {/* 二维码展示区 */}
          <div className="relative p-4 bg-white rounded-xl shadow-inner mb-6 group">
            <div className="relative w-48 h-48">
              <Image 
                src={method === 'wechat' ? "/images/wechat-qr.png" : "/images/alipay-qr.png"} 
                alt="Payment QR" 
                fill 
                className="object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <span className="text-[10px] text-black font-bold uppercase tracking-widest">Scan to Pay</span>
            </div>
          </div>

          {/* 步骤提示 */}
          <div className="w-full space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#00e0c6]/20 text-[#00e0c6] flex items-center justify-center shrink-0 mt-0.5"><Smartphone size={12}/></div>
              <p className="text-xs text-gray-400">1. Scan the QR code using your mobile app and complete the transfer.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#00e0c6]/20 text-[#00e0c6] flex items-center justify-center shrink-0 mt-0.5"><CheckCircle size={12}/></div>
              <p className="text-xs text-gray-400">2. Keep a screenshot of your successful payment confirmation.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#ff4fa6]/20 text-[#ff4fa6] flex items-center justify-center shrink-0 mt-0.5"><Send size={12}/></div>
              <p className="text-xs text-gray-300 font-bold">3. Contact our studio via WhatsApp to provide the screenshot and shipping details.</p>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 bg-black/20 text-center">
           <button 
            onClick={() => window.open('https://wa.me/YOUR_NUMBER', '_blank')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6] text-[#071018] font-black tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
           >
             CONFIRM ON WHATSAPP
           </button>
           <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-tighter">Your order will be processed immediately after verification.</p>
        </div>
      </div>
    </div>
  );
}