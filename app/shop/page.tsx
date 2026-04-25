// app/shop/page.tsx
'use client'
import { useState, useEffect, useMemo, Suspense } from 'react';
import { supabase } from '@/utils/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // ⚠️ 核心：引入路由参数钩子
import { Loader2, Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react'; // 引入 X 图标
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 核心内容组件 (必须抽离出来以配合 Suspense)
function ShopContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 获取 URL 中的搜索参数 ---
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  // --- 过滤与排序状态 ---
  const [filter, setFilter] = useState('All'); 
  const [searchQuery, setSearchQuery] = useState(urlQuery); // ⚠️ 初始值优先使用 URL 里的搜索词
  const [sortOption, setSortOption] = useState('newest'); 
  const [minPrice, setMinPrice] = useState<string>(''); 
  const [maxPrice, setMaxPrice] = useState<string>(''); 

  // ⚠️ 监听 URL 变化，同步更新搜索框状态
  useEffect(() => {
    if (searchParams.has('q')) {
      setSearchQuery(searchParams.get('q') || '');
    }
  }, [searchParams]);

  // --- 拉取全量真实数据 ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // --- 核心逻辑：多维度交叉过滤与排序 (0延迟本地计算) ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. 状态过滤 (Status)
    if (filter !== 'All') {
      result = result.filter(p => p.status === filter);
    }

    // 2. 关键词搜索 (Title or Artist)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        (p.artist && p.artist.toLowerCase().includes(query))
      );
    }

    // 3. 价格区间过滤 (Price Range)
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) result = result.filter(p => p.price >= min);
    if (!isNaN(max)) result = result.filter(p => p.price <= max);

    // 4. 排序 (Sorting)
    result.sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'sales') return (b.sales_count || 0) - (a.sales_count || 0); // 畅销优先
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [products, filter, searchQuery, minPrice, maxPrice, sortOption]);

  return (
    <main className="flex-grow max-w-[1400px] w-full mx-auto px-6 pt-32 pb-20">
      
      {/* 头部标题与分类 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold font-serif mb-2">The Collection</h1>
          <p className="text-gray-500">Discover hand-painted masterpieces and limited editions.</p>
        </div>

        <div className="flex gap-4 p-1 bg-white/5 border border-white/10 rounded-xl">
          {['All', 'In Stock', 'Pre-order'].map((item) => (
            <button 
              key={item}
              onClick={() => setFilter(item)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === item ? 'bg-white/10 text-[#00edce]' : 'text-gray-400 hover:text-white'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 控制面板：搜索、价格限制、排序 */}
      <div className="bg-[#0f1113] border border-white/5 p-4 rounded-2xl mb-12 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-lg">
        
        {/* 搜索框 */}
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by title or artist..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#05070a] border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm outline-none focus:border-[#00edce]/50 text-white transition-colors"
          />
          {/* 一键清除搜索 */}
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ff4fa6] transition-colors"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
          {/* 价格区间 */}
          <div className="flex items-center gap-2 w-full sm:w-auto bg-[#05070a] border border-white/10 rounded-xl px-4 py-1.5">
            <span className="text-gray-500 text-sm font-bold">$</span>
            <input 
              type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              className="w-16 bg-transparent text-sm outline-none text-white text-center placeholder-gray-600"
            />
            <span className="text-gray-600">-</span>
            <input 
              type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              className="w-16 bg-transparent text-sm outline-none text-white text-center placeholder-gray-600"
            />
          </div>

          {/* 排序方式 */}
          <div className="relative w-full sm:w-auto">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-48 appearance-none bg-[#05070a] border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm outline-none focus:border-[#00edce]/50 text-white cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="sales">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* 搜索提示条 */}
      {searchQuery && (
        <div className="mb-6 flex justify-between items-center text-sm font-bold bg-[#00edce]/5 border border-[#00edce]/20 px-4 py-3 rounded-xl text-[#00edce]">
          <span>Showing results for: "{searchQuery}"</span>
          <button onClick={() => setSearchQuery('')} className="underline hover:text-white transition-colors">View All Products</button>
        </div>
      )}

      {/* 商品展示区 */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-[#00edce]" size={40} />
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Accessing Database...</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <SlidersHorizontal className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No masterworks found.</h3>
          <p className="text-gray-400">Try adjusting your search criteria or price filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setMinPrice(''); setMaxPrice(''); setFilter('All'); setSortOption('newest'); }}
            className="mt-6 px-6 py-2 border border-white/20 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 bg-[#0a0b0c] transition-all group-hover:border-[#00edce]/30">
                <Image src={product.images?.[0] || 'https://via.placeholder.com/800'} alt={product.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                
                <div className={`absolute top-4 left-4 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${
                  product.status === 'In Stock' ? 'bg-[#00edce]/10 border-[#00edce]/30 text-[#00edce]' : 'bg-[#ff4fa6]/10 border-[#ff4fa6]/30 text-[#ff4fa6]'
                }`}>
                  {product.status}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold mb-1">{product.edition}</div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00edce] transition-colors">{product.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-black text-white">${product.price.toLocaleString()}</span>
                  {product.msrp && <span className="text-sm text-gray-600 line-through">${product.msrp.toLocaleString()}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

// ⚠️ 页面主入口，包裹 Suspense
export default function ShopPage() {
  return (
    <div className="bg-[#05070a] min-h-screen text-white flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center pt-32">
          <Loader2 className="animate-spin text-[#00edce]" size={40} />
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  );
}