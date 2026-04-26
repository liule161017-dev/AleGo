// app/components/CategorySection.tsx
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

interface CategoryProps {
  title: string;
  type: 'in-stock' | 'pre-order';
}

export default function CategorySection({ title, type }: CategoryProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      
      const dbStatus = type === 'in-stock' ? 'In Stock' : 'Pre-order';

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', dbStatus)
        .limit(4) 
        .order('created_at', { ascending: false });

      if (!error) {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchCategoryProducts();
  }, [type]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 px-6 md:px-16 max-w-[1400px] mx-auto relative z-10">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-white uppercase">{title}</h2>
          <p className="text-sm text-gray-500 mt-2">
            {type === 'in-stock' 
              ? 'Inspected and ready for global dispatch.' 
              : 'Reserve your piece of limited production runs.'}
          </p>
        </div>
        <Link href="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold text-[#00edce] hover:text-[#ff4fa6] transition-colors uppercase tracking-widest">
          View All <ArrowRight size={16} />
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#00edce]" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-in fade-in duration-700">
          {products.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0a0b0c] border border-white/5 group-hover:border-[#00edce]/50 transition-colors shadow-lg">
                {/* 🌟 核心修改：接入智能图片解析 */}
                <Image 
                  src={getImageUrl(item.images?.[0], item.sku, 1)} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {item.status === 'In Stock' && (
                  <div className="absolute top-3 left-3 bg-[#00edce]/20 text-[#00edce] border border-[#00edce]/30 px-2 py-1 rounded text-[10px] font-bold uppercase backdrop-blur-md">
                    In Stock
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <div className="text-[9px] uppercase tracking-[1.5px] text-gray-500 font-bold mb-1">{item.edition}</div>
                <h4 className="text-white font-bold text-lg group-hover:text-[#00edce] transition-colors truncate">{item.title}</h4>
                <p className="text-gray-400 font-mono mt-1 text-sm">${item.price.toLocaleString()} USD</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}