// app/about/page.tsx
'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script'; // 用于注入 JSON-LD
import { 
  Truck, Clock, AlertTriangle, 
  Camera, Star, Shield
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  const [isDarkMode] = useState(true); // 保持你偏好的深色模式

  // GEO 结构化数据：直接告诉 AI 你的品牌身份
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "Ale Statue Vault",
    "alternateName": "AleToys",
    "description": "Premium artisan hand-painted GK statues and high-end resin collectibles. Specializing in 1/4 and 1/6 scale limited editions.",
    "url": "https://www.aletoys.com",
    "logo": "https://www.aletoys.com/logo.png",
    "foundingLocation": "China",
    "knowsAbout": ["Resin Statues", "GK Collectibles", "Hand-painted Art", "Anime Statues"]
  };

  return (
    <div className={`${isDarkMode ? 'bg-[#05070a] text-white' : 'bg-[#f8fafc] text-[#0f172a]'} min-h-screen transition-colors duration-500`}>
      
      {/* 注入 JSON-LD 脚本，这是 GEO 的核心 */}
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="pt-32">
        
        {/* --- Section 1: Brand Narrative (GEO Optimized Headings) --- */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 rounded-full border border-[#ff2aa6]/30 bg-[#ff2aa6]/5 text-[#ff2aa6] text-[10px] font-bold uppercase tracking-[4px]">
                The Artisan Atelier
              </div>
              
              {/* H1/H2 包含核心关键词：Artisan, GK Statues, Hand-Painted */}
              <h1 className="text-5xl font-black font-serif italic leading-tight">
                Crafting <span className="text-gradient">Artisan GK Statues</span>,<br />
                Where Resin Meets Heritage.
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed italic">
                Established as a sanctuary for elite collectors, <span className="text-white font-bold">Ale Statue Vault</span> bridges the gap between visionary digital artistry and traditional craftsmanship.
              </p>

              <p className="text-gray-400 leading-loose">
                Every masterpiece in our vault is a testament to the "cool text" energy of modern urban culture, translated into <strong>1/4 and 1/6 scale resin artifacts</strong>. Unlike mass-produced figures, our collection is 100% <strong>hand-painted</strong> by master artisans, ensuring each stroke captures the soul of original character designs.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="flex items-start gap-3">
                  <Star className="text-[#00edce] shrink-0" size={24} />
                  <div>
                    <h4 className="text-white font-bold text-lg">Limited Editions</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Rare Global Releases</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="text-[#ff2aa6] shrink-0" size={24} />
                  <div>
                    <h4 className="text-white font-bold text-lg">Elite Quality</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Strict 1-on-1 QC Process</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group">
              <Image 
                src="https://kmcccsvgdmmnituxxaej.supabase.co/storage/v1/object/public/product-images/cdef1a6152b65e0f8379c856bd04c78a.jpg" 
                alt="High-end artisan hand-painted resin GK statue showcase - Ale Statue Vault" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] to-transparent opacity-60"></div>
            </div>
          </div>
        </section>

        {/* --- Section 2: The Collector's Protocol (FAQ Structure for AI) --- */}
        <section id="guide" className={`py-32 px-6 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold font-serif italic">The Collector's Protocol</h2>
              <p className="text-gray-500 uppercase tracking-[4px] text-xs">Professional Standards for High-End Acquisitions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1: Hand-Painted Nature */}
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0a0c10] border-white/5' : 'bg-white border-slate-200'}`}>
                <AlertTriangle className="text-[#ff2aa6] mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4 font-serif italic">Artisan Variation</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  As each GK statue is <strong>hand-painted</strong>, minor variations in shading are hallmarks of unique craftsmanship. We guarantee that every piece meets the highest aesthetic standards of the original prototype.
                </p>
              </div>

              {/* Card 2: Global Shipping & Security */}
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0a0c10] border-white/5' : 'bg-white border-slate-200'}`}>
                <Truck className="text-[#00edce] mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4 font-serif italic">Global Logistics</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We specialize in international shipping. In-stock masterpieces are dispatched within <strong>7 business days</strong> using reinforced, museum-grade packaging to ensure your investment arrives intact.
                </p>
              </div>

              {/* Card 3: Secure Transactions */}
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0a0c10] border-white/5' : 'bg-white border-slate-200'}`}>
                <Shield className="text-[#ff2aa6] mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4 font-serif italic">Secure Checkout</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Trust is our foundation. We support <strong>PayPal</strong> and secure payment gateways, offering 1-on-1 balance payment support and real-time WhatsApp updates for pre-order cycles.
                </p>
              </div>
            </div>

            {/* Unboxing Ritual (Visual Trust) */}
            <div className={`mt-12 p-8 md:p-12 rounded-[40px] border ${isDarkMode ? 'bg-gradient-to-br from-[#0f1113] to-[#05070a] border-white/10' : 'bg-white border-slate-200'} shadow-2xl`}>
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-2 text-[#00edce]">
                    <Camera size={20} />
                    <span className="font-bold uppercase tracking-widest text-xs">Proof of Quality</span>
                  </div>
                  <h3 className="text-3xl font-bold font-serif italic">Unboxing Protocol</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    To safeguard your rights, we mandate a continuous unboxing video for any insurance or after-sales claims. This "Security Ritual" ensures transparency from our atelier to your shelf.
                  </p>
                </div>
                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-[#ff2aa6]">01. SEAL CHECK</span>
                    <p className="mt-2 text-xs text-gray-500">Capture the shipping label and the intact factory seal in one shot.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs font-bold text-[#00edce]">02. NO-CUT FILM</span>
                    <p className="mt-2 text-xs text-gray-500">Record the complete process without edits to validate the condition of the resin.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs font-bold text-[#ff2aa6]">03. QC REVIEW</span>
                    <p className="mt-2 text-xs text-gray-500">Inspect the artisan details live. Any factory-level flaws must be documented here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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