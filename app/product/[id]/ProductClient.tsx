// app/product/[id]/ProductClient.tsx
'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronLeft, ShieldCheck, Box, Ruler, Weight, ExternalLink, MessageCircle, Heart, X } from 'lucide-react';
import { FaWeixin, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useNotification } from '@/context/NotificationContext';

const SUPABASE_IMG_BASE = "https://kmcccsvgdmmnituxxaej.supabase.co/storage/v1/object/public/product-images/";

const getImageUrl = (imageValue: string | null | undefined, sku: string, index = 1) => {
  if (imageValue && imageValue.startsWith('http')) return imageValue;
  if (imageValue) return `${SUPABASE_IMG_BASE}${imageValue}`;
  const safeSku = sku || 'default';
  return `${SUPABASE_IMG_BASE}${safeSku}-0${index}.jpg`;
};

export default function ProductClient({ id, initialProduct }: { id: string, initialProduct: any }) {
  const router = useRouter();
  const { showToast } = useNotification();
  
  // 直接使用服务端传来的数据
  const product = initialProduct;
  
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeQr, setActiveQr] = useState<'wechat' | 'whatsapp' | 'ins' | null>(null);

  const WECHAT_QR = "https://kmcccsvgdmmnituxxaej.supabase.co/storage/v1/object/public/product-images/wechat.jpg";
  const WHATSAPP_QR = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=400";
  const INS_QR = "https://images.unsplash.com/photo-1611223235982-182934628a58?q=80&w=400";
  const WHATSAPP_LINK = "https://wa.me/8617666271216?text=Hi,%20I'm%20interested%20in%20acquiring%20a%20masterpiece."; 
  const INSTAGRAM_LINK = "https://instagram.com/altoys_anime";

  useEffect(() => {
    const checkWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('wishlists').select('id').eq('user_id', user.id).eq('product_id', id).single();
      if (data) setIsInWishlist(true);
    };
    checkWishlist();
  }, [id]);

  const handleToggleWishlist = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast('info', 'Please login to manage your collection.');
      router.push('/login');
      setIsProcessing(false);
      return;
    }
    if (isInWishlist) {
      const { error } = await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', id);
      if (!error) { setIsInWishlist(false); showToast('success', 'Removed from wishlist.'); }
    } else {
      const { error } = await supabase.from('wishlists').insert([{ user_id: user.id, product_id: id }]);
      if (!error) { setIsInWishlist(true); showToast('success', 'Added to wishlist.'); }
    }
    setIsProcessing(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white">
        <p>Masterpiece not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#05070a] min-h-screen text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-[1400px] mx-auto px-6 pt-32 pb-20 w-full">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-[#00edce] transition-colors mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#0a0b0c] border border-white/5 shadow-2xl">
              <Image src={getImageUrl(product.images?.[activeImg], product.sku, activeImg + 1)} alt={product.title} fill className="object-cover animate-in fade-in duration-500" priority />
              <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${product.status === 'In Stock' ? 'bg-[#00edce]/10 border-[#00edce]/30 text-[#00edce]' : 'bg-[#ff4fa6]/10 border-[#ff4fa6]/30 text-[#ff4fa6]'}`}>
                {product.status}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setActiveImg(idx)} className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImg === idx ? 'border-[#00edce] scale-95 shadow-[0_0_15px_rgba(0,237,206,0.3)]' : 'border-white/5 opacity-50 hover:opacity-100'}`}>
                  <Image src={getImageUrl(img, product.sku, idx + 1)} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-[3px] text-[#ff4fa6] mb-3">{product.edition} Series</div>
              <h1 className="text-4xl md:text-5xl font-black font-serif mb-4 leading-tight">{product.title}</h1>
              <div className="flex items-center gap-2 text-gray-500 mb-6">
                <span className="text-sm font-bold uppercase tracking-widest">Artisan:</span>
                <span className="text-sm font-bold text-white uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">{product.artist || 'Master Studio'}</span>
              </div>
              <div className="space-y-4 py-6 border-b border-white/5">
                {product.status === 'Pre-order' ? (
                  <>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-[3px] text-gray-500 mb-1">Non-Refundable Deposit</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-[#00edce]">${product.deposit}</span>
                        <span className="text-sm text-gray-400 italic">due today</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs uppercase tracking-[2px] text-gray-500">Full Price:</span>
                      <span className="text-lg font-bold text-white/80">${product.price}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-[3px] text-gray-500 mb-1">Price</span>
                    <span className="text-4xl font-black text-white">${product.price}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {product.specs && Object.entries(product.specs).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                  <div className="text-[#00edce]">{key.toLowerCase().includes('size') ? <Ruler size={20} /> : <Weight size={20} />}</div>
                  <div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">{key}</div>
                    <div className="text-sm font-bold text-white">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-400 leading-loose text-lg whitespace-pre-line mb-10">{product.description}</p>

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <button onClick={() => setIsContactModalOpen(true)} className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-[#ff4fa6] to-[#00edce] text-[#071018] font-black uppercase tracking-[2px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <MessageCircle size={20} /> Inquire & Acquire
              </button>
              <button onClick={handleToggleWishlist} disabled={isProcessing} className={`flex-1 py-5 rounded-2xl border transition-all flex items-center justify-center gap-2 ${isInWishlist ? 'bg-[#ff4fa6]/10 border-[#ff4fa6] text-[#ff4fa6]' : 'border-white/10 hover:bg-white/5 text-sm font-bold uppercase tracking-widest'}`}>
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isInWishlist ? "#ff4fa6" : "none"} />}
                {isInWishlist ? 'Saved' : 'Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* 弹窗部分 */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1113] border border-white/10 p-8 rounded-3xl w-full max-w-md relative">
            <button onClick={() => { setIsContactModalOpen(false); setActiveQr(null); }} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20} /></button>
            <h2 className="text-2xl font-serif font-bold mb-8">Acquire Masterpiece</h2>
            {activeQr ? (
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-white rounded-xl p-2 mb-6 relative border-2 border-[#00edce]/50">
                  <Image src={activeQr === 'wechat' ? WECHAT_QR : activeQr === 'whatsapp' ? WHATSAPP_QR : INS_QR} alt="QR" fill className="object-cover rounded-lg" />
                </div>
                <button onClick={() => setActiveQr(null)} className="text-sm font-bold text-gray-500">← Back</button>
              </div>
            ) : (
              <div className="space-y-4">
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[#25D366]/10 transition-all">
                  <div className="text-2xl text-[#25D366]"><FaWhatsapp /></div>
                  <div className="font-bold">WhatsApp</div>
                </a>
                <button onClick={() => setActiveQr('wechat')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[#09B83E]/10 transition-all">
                  <div className="text-2xl text-[#09B83E]"><FaWeixin /></div>
                  <div className="font-bold">WeChat</div>
                </button>
                <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[#E1306C]/10 transition-all">
                  <div className="text-2xl text-[#E1306C]"><FaInstagram /></div>
                  <div className="font-bold">Instagram</div>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}