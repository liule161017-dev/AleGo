// app/about/page.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, User, ShoppingCart, 
  ShieldCheck, Truck, Clock, AlertTriangle, 
  MessageCircle, Send, Camera, Sun, Moon 
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaChevronRight } from 'react-icons/fa';

export default function AboutPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // 监听滚动，保持 Header 效果与首页一致
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${isDarkMode ? 'bg-[#05070a] text-white' : 'bg-[#f8fafc] text-[#0f172a]'} min-h-screen transition-colors duration-500`}>
      
      {/* --- 1. HEADER (复用你的 Navbar 结构) --- */}
    <Navbar/>
      {/* --- 2. 主体内容区域 --- */}
      <main className="pt-32">
        
        {/* 关于我们: Brand Narrative */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 rounded-full border border-[#ff2aa6]/30 bg-[#ff2aa6]/5 text-[#ff2aa6] text-[10px] font-bold uppercase tracking-[4px]">
                Our Atelier
              </div>
              <h2 className="text-5xl font-black font-serif italic leading-tight">
                Crafting <span className="text-gradient">Legends</span>,<br />One Stroke at a Time.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed italic">
                Born in the heart of artisan heritage in China, <span className="text-white font-bold">ALeToys</span> is more than a brand—it is a sanctuary for high-end collectibles. We don't just sell statues; we curate dreams.
              </p>
              <p className="text-gray-400 leading-loose">
                Each piece in our collection undergoes a rigorous journey: from visionary digital modeling to the delicate hands of master painters. Every artifact is <strong>hand-painted</strong>, ensuring that the soul of the character resonates through the resin. This is where high-paced urban energy meets the timeless patience of craftsmanship.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h4 className="text-[#00edce] font-black text-2xl">Limited</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Strict Edition Sizes</p>
                </div>
                <div>
                  <h4 className="text-[#ff2aa6] font-black text-2xl">Artisan</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">100% Hand-Painted</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group">
              <Image 
                src="https://kmcccsvgdmmnituxxaej.supabase.co/storage/v1/object/public/product-images/cdef1a6152b65e0f8379c856bd04c78a.jpg" 
                alt="Artisan Craft" fill className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] to-transparent opacity-60"></div>
            </div>
          </div>
        </section>

        {/* 购物须知: The Protocol (Guide) */}
        <section id="guide" className={`py-32 px-6 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold font-serif italic">The Collector's Protocol</h2>
              <p className="text-gray-500 uppercase tracking-[4px] text-xs">Essential terms for acquiring masterpieces</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0a0c10] border-white/5' : 'bg-white border-slate-200'}`}>
                <AlertTriangle className="text-[#ff2aa6] mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4 font-serif italic">Artisan Nature</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Every artifact is handcrafted. Minor variations or subtle character marks are the soul of the artist's work. Perfectionists should consider this unique nature before acquisition.
                </p>
              </div>
              {/* Card 2 */}
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0a0c10] border-white/5' : 'bg-white border-slate-200'}`}>
                <Truck className="text-[#00edce] mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4 font-serif italic">Logistics</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  In-stock items ship within <strong>7 business days</strong>. All freight is calculated on delivery (Freight Collect). Please monitor your tracking number for real-time progress.
                </p>
              </div>
              {/* Card 3 */}
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0a0c10] border-white/5' : 'bg-white border-slate-200'}`}>
                <Clock className="text-[#ff2aa6] mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4 font-serif italic">Pre-Order Covenant</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Cycles run <strong>6-8 months</strong>. Due to high labor costs, deposits are <strong>non-refundable and non-exchangeable</strong>. Balance payment is required 1-on-1 upon completion.
                </p>
              </div>
            </div>

            {/* Unboxing Protocol */}
            <div className={`mt-12 p-8 md:p-12 rounded-[40px] border ${isDarkMode ? 'bg-gradient-to-br from-[#0f1113] to-[#05070a] border-white/10' : 'bg-white border-slate-200'} shadow-2xl`}>
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-2 text-[#00edce]">
                    <Camera size={20} />
                    <span className="font-bold uppercase tracking-widest text-xs">Security Ritual</span>
                  </div>
                  <h3 className="text-3xl font-bold font-serif italic">Unboxing Protocol</h3>
                  <p className="text-gray-400 text-sm">
                    To ensure your rights, a continuous unboxing video is mandatory for after-sales claims.
                  </p>
                </div>
                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-[#ff2aa6]">01. SEAL</span>
                    <p className="mt-2 text-xs text-gray-500">Capture the shipping label and intact seal clearly in frame.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs font-bold text-[#00edce]">02. FLOW</span>
                    <p className="mt-2 text-xs text-gray-500">Film the entire opening process. No cuts, no post-edits.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs font-bold text-[#ff2aa6]">03. PROOF</span>
                    <p className="mt-2 text-xs text-gray-500">Inspect the piece on camera. Any factory flaws must be spotted "live".</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- 3. FOOTER (复用你的 Footer 结构) --- */}
     <Footer />

    

      <style jsx>{`
        .text-gradient {
          background: linear-gradient(to right, #ff2aa6, #00edce);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}