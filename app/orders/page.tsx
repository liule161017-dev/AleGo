// app/orders/page.tsx
'use client'
import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/utils/supabase'; // 引入数据库实例
import Image from 'next/image'; // 引入真实图片组件
import { Loader2 } from 'lucide-react';
import './orders.css';
import OrderDrawer from './components/OrderDrawer';
// 复用全局组件
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 定义真实订单的数据结构
export type RealOrder = {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  artisan_note: string | null;
  payment_method: string;
  shipping_address: any;
  order_items: {
    quantity: number;
    price_at_purchase: number;
    products: {
      id: string;
      title: string;
      images: string[];
      edition: string;
    }
  }[];
};

export default function OrdersPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // 增加 'processing' (已付款待发货) 状态以匹配真实数据库
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const perPage = 4;
  
  // 真实数据状态
  const [orders, setOrders] = useState<RealOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<RealOrder | null>(null);

  // 1. 抓取真实数据库数据
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // 如果未登录，实际项目中可以加个 router.push('/login')

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_purchase,
            products (id, title, images, edition)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as RealOrder[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // 2. 高性能筛选与排序 (使用真实数据状态)
  const filteredOrders = useMemo(() => {
    let list = [...orders];
    
    // 状态过滤映射 (UI 标签 -> 数据库 status 字段)
    if (filter !== 'all') {
      const statusMap: Record<string, string[]> = {
        pending: ['pending_review'], // 待审核
        processing: ['paid'],        // 已确认/备货中
        shipped: ['shipped'],        // 运输中
        delivered: ['delivered']     // 已交付
      };
      list = list.filter(o => statusMap[filter]?.includes(o.status));
    }

    // 排序逻辑替换为真实字段 (created_at, total_amount)
    switch (sort) {
      case 'newest': list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'oldest': list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break;
      case 'price-high': list.sort((a, b) => b.total_amount - a.total_amount); break;
      case 'price-low': list.sort((a, b) => a.total_amount - b.total_amount); break;
    }
    return list;
  }, [orders, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const currentOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <div className="orders-theme-wrapper min-h-screen flex items-center justify-center transition-colors duration-300" data-theme={theme} style={{ backgroundColor: 'var(--bg)' }}>
        <Loader2 className="animate-spin text-[#00edce]" size={48} />
      </div>
    );
  }

  return (
    // 用一个包裹器来控制局部的主题 CSS 变量
    <div className="orders-theme-wrapper min-h-screen flex flex-col transition-colors duration-300" data-theme={theme} style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      
      {/* 顶部导航 */}
      <Navbar />

      {/* 主题切换悬浮球 */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed right-6 bottom-24 z-[90] w-12 h-12 rounded-full border flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-110"
        style={{ background: 'var(--glass)', borderColor: 'var(--border-color)', color: 'var(--text)' }}
      >
        {theme === 'dark' ? '☀️' : '☾'}
      </button>

      <main className="flex-grow max-w-[1150px] mx-auto px-4 py-28 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        
        {/* 左侧：订单列表区 */}
        <div>
          {/* 页面介绍卡片 */}
          <div className="p-6 rounded-2xl shadow-sm border mb-4" style={{ background: 'linear-gradient(180deg, var(--glass), transparent)', borderColor: 'var(--border-color)' }}>
            <div className="text-xs font-extrabold tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>Order Manifests</div>
            <h1 className="text-2xl font-bold mb-3">Follow your pieces — from the bench to your shelf</h1>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
              Each ALeToys creation is a hand‑told story... Below you’ll find your orders, artisan notes, and tracking updates.
            </p>

            {/* 过滤器与排序 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2 bg-[var(--glass)] p-1 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                {['all', 'pending', 'processing', 'shipped', 'delivered'].map(f => (
                  <button 
                    key={f} onClick={() => {setFilter(f as any); setPage(1);}}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${filter === f ? 'shadow-md' : 'opacity-60 hover:opacity-100'}`}
                    style={{ background: filter === f ? 'var(--panel)' : 'transparent', color: filter === f ? 'var(--text)' : 'var(--muted)' }}
                  >
                    {f === 'pending' ? 'Reviewing' : f === 'processing' ? 'Preparing' : f === 'shipped' ? 'In transit' : f}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border rounded-lg px-3 py-1.5 text-sm outline-none" style={{ borderColor: 'var(--border-color)', color: 'var(--text)' }}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* 订单列表 */}
          <div className="p-4 rounded-2xl border" style={{ background: 'linear-gradient(180deg, var(--glass), transparent)', borderColor: 'var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
            {currentOrders.length === 0 ? (
              <div className="py-12 text-center text-sm font-bold" style={{ color: 'var(--muted)' }}>No orders match your criteria.</div>
            ) : (
              <div className="space-y-3">
                {currentOrders.map(o => {
                  // 提取订单中的第一个商品作为封面
                  const firstProduct = o.order_items?.[0]?.products;
                  
                  return (
                    <div key={o.id} onClick={() => setSelectedOrder(o)} className="order-row p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 cursor-pointer transition-all hover:scale-[1.01]">
                      
                      <div className="flex gap-4 items-center">
                        {/* 真实的数据库商品图片 */}
                        <div className="relative w-20 h-20 rounded-xl flex flex-shrink-0 items-center justify-center overflow-hidden shadow-inner border border-white/5" style={{ background: 'var(--glass)' }}>
                          <Image 
                            src={firstProduct?.images?.[0] || 'https://via.placeholder.com/150'} 
                            alt={firstProduct?.title || 'Product'} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[var(--text)]">{firstProduct?.title || 'Unknown Masterpiece'}</div>
                          <div className="text-xs text-[var(--muted)] mt-1" suppressHydrationWarning>
                            {firstProduct?.edition || 'Collector'} Edition • {new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                          {/* 如果后台有给这个订单写专属留言，则展示；否则展示默认提示 */}
                          <div className="text-xs text-[var(--muted)] mt-1 line-clamp-1 italic">
                            {o.artisan_note || (o.status === 'pending_review' ? 'Awaiting curator verification...' : 'Processing in studio.')}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2">
                        {/* 真实的订单总价 */}
                        <div className="text-lg font-black bg-clip-text text-transparent" style={{ backgroundImage: 'var(--accent-grad)' }}>
                          ${o.total_amount.toLocaleString()}
                        </div>
                        
                        {/* 动态渲染状态样式 */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          o.status === 'pending_review' ? 'status-pending' : 
                          o.status === 'shipped' ? 'status-shipped' : 
                          o.status === 'delivered' ? 'status-delivered' : 'bg-[#00edce]/10 text-[#00edce] border border-[#00edce]/20'
                        }`}>
                          {o.status === 'pending_review' ? 'Reviewing' : 
                           o.status === 'paid' ? 'Preparing' : 
                           o.status === 'shipped' ? 'In transit' : 'Delivered'}
                        </div>
                        
                        <div className="hidden md:flex gap-2 mt-1">
                          <button onClick={(e) => {e.stopPropagation(); setSelectedOrder(o)}} className="px-3 py-1 rounded-lg border text-xs font-bold hover:bg-[var(--glass)]" style={{ borderColor: 'var(--border-color)', color: 'var(--text)' }}>View Details</button>
                          <button onClick={(e) => {e.stopPropagation(); window.open('https://wa.me/YOUR_NUMBER', '_blank')}} className="px-3 py-1 rounded-lg text-xs font-bold text-[#071018] opacity-90 hover:opacity-100" style={{ background: 'var(--accent-grad)' }}>Contact</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 保持你原本完美的分页逻辑 */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border text-sm font-bold disabled:opacity-30" style={{ borderColor: 'var(--border-color)', color: 'var(--muted)' }}>Prev</button>
                <span className="px-4 py-1.5 font-bold" style={{ color: 'var(--accent-2)' }}>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border text-sm font-bold disabled:opacity-30" style={{ borderColor: 'var(--border-color)', color: 'var(--muted)' }}>Next</button>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：客服与说明区 (完全保留) */}
        <aside className="p-6 rounded-2xl border self-start sticky top-28" style={{ background: 'linear-gradient(180deg, var(--glass), transparent)', borderColor: 'var(--border-color)' }}>
          <h3 className="font-bold text-lg mb-2">Need help with an order?</h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
            Collecting is personal — if you’d like packing photos, detailed provenance scans, or a note from the artist, we’re happy to provide it.
          </p>
          <button 
            onClick={() => window.open('https://wa.me/YOUR_NUMBER', '_blank')}
            className="w-full py-3 rounded-xl font-bold text-[#071018] shadow-lg hover:opacity-90 mb-6 transition-opacity" 
            style={{ background: 'var(--accent-grad)' }}
          >
            Request artisan note
          </button>
          
          <div className="space-y-4 text-sm">
            <div><strong className="text-[var(--text)]">Provenance:</strong> <span style={{ color: 'var(--muted)' }}>Certificate signed by the sculptor included with limited runs.</span></div>
            <div><strong className="text-[var(--text)]">Hand‑finished:</strong> <span style={{ color: 'var(--muted)' }}>Subtle variations are expected — they are the maker’s fingerprint.</span></div>
            <div><strong className="text-[var(--text)]">Care:</strong> <span style={{ color: 'var(--muted)' }}>Keep out of prolonged sunlight; dust with a soft brush.</span></div>
          </div>
        </aside>

      </main>

      <Footer />

      {/* 订单详情抽屉 */}
      <OrderDrawer 
        isOpen={selectedOrder !== null} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />

    </div>
  );
}