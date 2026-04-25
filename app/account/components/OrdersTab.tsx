// app/account/components/OrdersTab.tsx
'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader2, Package, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 抓取订单，并关联 order_items 里的商品信息
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_purchase,
            products (title, images)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-[#00e0c6]"><Loader2 className="animate-spin" /></div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
        <Package className="mx-auto text-gray-600 mb-4" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest">No Acquisitions Found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {orders.map((order) => (
        <div key={order.id} className="bg-[#0f1113] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          {/* 订单头部：单号与状态 */}
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold mb-1">Entry ID</div>
              <div className="text-lg font-mono font-bold text-white">#{order.id}</div>
            </div>
            
            {/* 动态状态标签 */}
            <div className="flex items-center gap-3">
              {order.status === 'pending_review' ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff4fa6]/10 border border-[#ff4fa6]/20 text-[#ff4fa6] text-xs font-bold uppercase tracking-widest">
                  <Clock size={14} className="animate-pulse" /> Pending Curator Review
                </div>
              ) : order.status === 'paid' ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00e0c6]/10 border border-[#00e0c6]/20 text-[#00e0c6] text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} /> Confirmed & Processing
                </div>
              ) : (
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  {order.status}
                </div>
              )}
            </div>
          </div>

          {/* 订单内容：商品展示 */}
          <div className="p-6">
            {order.order_items.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-6 items-center">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black">
                  <Image 
                    src={item.products.images?.[0] || 'https://via.placeholder.com/200'} 
                    alt="Product" fill className="object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">{item.products.title}</h4>
                  <div className="text-sm text-gray-500 mt-1">Quantity: {item.quantity} × ${item.price_at_purchase.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Paid</div>
                  <div className="text-xl font-black text-white">${order.total_amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 订单脚注：24小时提示 */}
          {order.status === 'pending_review' && (
            <div className="bg-[#ff4fa6]/5 p-4 flex items-center justify-center gap-2">
              <span className="text-[11px] font-bold text-[#ff4fa6] uppercase tracking-[1px]">
                Verification usually completes within 24 hours. Items are reserved during this period.
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}