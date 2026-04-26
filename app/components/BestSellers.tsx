// app/components/BestSellers.tsx
'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

// 图片基础路径前缀与智能解析函数
const SUPABASE_IMG_BASE = "https://kmcccsvgdmmnituxxaej.supabase.co/storage/v1/object/public/product-images/";

const getImageUrl = (imageValue: string | null | undefined, sku: string, index = 1) => {
  if (imageValue && imageValue.startsWith('http')) return imageValue;
  if (imageValue) return `${SUPABASE_IMG_BASE}${imageValue}`;
  const safeSku = sku || 'default';
  return `${SUPABASE_IMG_BASE}${safeSku}-0${index}.jpg`;
};

export default function BestSellers() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('sales_count', { ascending: false })
        .limit(3);
      
      setItems(data || []);
      setLoading(false);
    };
    fetchBestSellers();
  }, []);

  if (loading) return null; 

  return (
    <section className="py-24 px-6 relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-24 tracking-widest uppercase text-white">
        Top 3 <span className="text-gradient-primary">Masterpieces</span>
      </h2>
      
      <div className="max-w-6xl mx-auto space-y-24">
        {items.map((item, index) => (
          <div key={item.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20 group`}>
            {/* 图片部分 */}
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#ff4fa6]/10 to-[#00edce]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b0c] shadow-2xl aspect-video md:aspect-[4/3]">
                {/* 🌟 核心修改：接入智能图片解析 */}
                <Image 
                  src={getImageUrl(item.images?.[0], item.sku, 1)} 
                  alt={item.title} 
                  fill 
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 w-12 h-12 flex items-center justify-center rounded-full text-xl font-black text-[#00edce]">
                  0{index + 1}
                </div>
              </div>
            </div>

            {/* 文字部分 */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-8 h-px bg-[#00edce]"></span>
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Current Rank #{index + 1}</span>
              </div>
              <h3 className="text-3xl font-bold mb-6 tracking-wider uppercase text-white group-hover:text-[#00edce] transition-colors">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-8 text-lg line-clamp-3">
                {item.description}
              </p>
              
              <Link href={`/product/${item.id}`} className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
                Explore Piece <ArrowRight size={18} className="text-[#00edce]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}