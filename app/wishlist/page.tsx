// app/wishlist/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Trash2, ChevronLeft, Heart } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useNotification } from '@/context/NotificationContext';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  const fetchWishlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('wishlists')
      .select(`id, products (*)`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWishlist(); }, []);

  const removeFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase.from('wishlists').delete().eq('id', wishlistId);
    if (!error) {
      setItems(items.filter(item => item.id !== wishlistId));
      showToast('success', 'Masterpiece released.');
    }
  };

  return (
    <div className="bg-[#05070a] min-h-screen text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 pt-32 pb-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold">Your Private Collection</h1>
            <p className="text-gray-500 mt-2">Saved masterpieces awaiting your acquisition.</p>
          </div>
          <div className="text-[#00edce] font-mono font-bold">{items.length} PIECES</div>
        </div>

        {loading ? (
          <div className="flex justify-center py-40"><Loader2 className="animate-spin text-[#00edce]" size={40} /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <Heart size={48} className="mx-auto text-gray-700 mb-6" />
            <p className="text-xl text-gray-400 font-bold mb-8">Your gallery is empty.</p>
            <Link href="/shop" className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff4fa6] to-[#00edce] text-black font-bold uppercase tracking-widest">Explore Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            {items.map((item) => (
              <div key={item.id} className="group relative bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-[#00edce]/30 transition-all shadow-2xl">
                <Link href={`/product/${item.products.id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={item.products.images?.[0]} alt={item.products.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                      {item.products.edition}
                    </div>
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <Link href={`/product/${item.products.id}`} className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-[#00edce] transition-colors truncate">{item.products.title}</h3>
                      <p className="text-[#00edce] font-black mt-1">${item.products.price.toLocaleString()}</p>
                    </Link>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-[#ff4fa6]/10 text-gray-500 hover:text-[#ff4fa6] transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}