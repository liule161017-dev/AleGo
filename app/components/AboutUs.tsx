// app/components/AboutUs.tsx
import Link from 'next/link';

export default function AboutUs() {
  // ⚠️ 在这里替换为你的真实链接
  const TAOBAO_LINK = "https://shop393352926.world.taobao.com/shop/view_shop.htm?appUid=RAzN8HWTJAdGjT6G8TxkddgKiHPHuiP8gGevVR44G4tQWNucCnp&spm=a21n57.1.hoverItem.3"; // 你的淘宝店铺主页链接
  const WHATSAPP_LINK = "https://wa.me/1234567890?text=Hi,%20I'd%20like%20to%20know%20more%20about%20ALeToys."; // 你的 WhatsApp 链接

  return (
    <section className="py-24 px-6 relative z-10 flex justify-center">
      <div className="max-w-5xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* 面板内部的上下装饰光晕 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[#ff4fa6]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-[#00e0c6]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#ff4fa6] shadow-[0_0_10px_#ff4fa6]"></span>
          <span className="text-xs font-bold tracking-widest text-gray-300 uppercase">The Atelier</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight text-white">
          Crafted with <span className="text-gradient-primary">Soul</span>,<br className="hidden md:block"/> Delivered with Pride.
        </h2>
        
        <p className="max-w-3xl mx-auto text-gray-400 leading-loose text-base md:text-lg mb-10">
          At <strong>ALeToys (Ale Statue Vault)</strong>, every resin statue is born from a passion for design and a commitment to uncompromising craftsmanship. Our artisans carefully sculpt and hand-paint each detail, using only premium materials to ensure every piece passes our strict 1-on-1 Quality Control. Perfect for discerning collectors across North America, Europe, and beyond seeking authentic GK masterpieces.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* 跳转到淘宝官网 */}
          {/* <a 
            href={TAOBAO_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 w-full sm:w-auto rounded-xl font-bold text-[#071018] shadow-[0_0_20px_rgba(0,224,198,0.3)] hover:scale-105 transition-all bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6] uppercase tracking-widest text-sm text-center"
          >
            Visit Taobao Store
          </a> */}
          
          {/* 跳转到 WhatsApp */}
          <Link href="/about" className="px-8 py-4 w-full sm:w-auto rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all uppercase tracking-widest text-sm">
          Discover Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}