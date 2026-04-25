// app/checkout/[id]/page.tsx
'use client'
import { useState, useEffect, use } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// 引入海外和国内常用的社交图标
import { FaWeixin, FaWhatsapp, FaInstagram, FaCheckCircle, FaPlus } from 'react-icons/fa';
import { Loader2, X, ExternalLink } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import './checkout.css';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useNotification();
  
  // 核心数据状态
  const [product, setProduct] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 联络与订单状态
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'instagram' | 'wechat' | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // 新增地址状态
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);

  // ⚠️ 你的真实私域联系方式配置
  const WECHAT_QR = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400"; // 微信二维码
  const WHATSAPP_LINK = "https://wa.me/1234567890?text=Hi,%20I'm%20interested%20in%20acquiring%20a%20masterpiece."; // 换成你的 WhatsApp 链接
  const INSTAGRAM_LINK = "https://instagram.com/your_official_account"; // 换成你的 IG 链接

  const fetchAddresses = async (userId: string) => {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) {
      setAddresses(data);
      if (!selectedAddrId && data.length > 0) setSelectedAddrId(data[0].id);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      if (!prod) {
        showToast('error', 'Product not found.');
        return router.push('/shop');
      }
      setProduct(prod);
      
      await fetchAddresses(user.id);
      setLoading(false);
    };
    loadData();
  }, [id, router, showToast]);

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingAddress(true);
    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const newAddr = {
      user_id: user.id,
      recipient_name: formData.get('recipient_name'), phone: formData.get('phone'),
      address_line1: formData.get('address_line1'), city: formData.get('city'),
      region: formData.get('region'), postal_code: formData.get('postal_code'),
      country: formData.get('country'), is_primary: addresses.length === 0
    };

    const { data, error } = await supabase.from('addresses').insert([newAddr]).select().single();

    if (error) {
      showToast('error', 'Failed to save address.');
    } else {
      showToast('success', 'Manifest updated.');
      setIsAddressModalOpen(false);
      await fetchAddresses(user.id);
      setSelectedAddrId(data.id);
    }
    setSubmittingAddress(false);
  };

  const handleProceed = () => {
    if (!selectedAddrId) return showToast('error', "Please select a shipping manifest.");
    if (!contactMethod) return showToast('error', "Please select a concierge channel.");
    
    // 生成订单号 (前缀可自定，如 ALET = AleToys)
    setOrderId(`ALET-${Math.floor(Math.random() * 899999 + 100000)}`);
    setIsContactModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    showToast('loading', 'Securing your masterpiece record...');
    const { data: { user } } = await supabase.auth.getUser();
    const finalAddress = addresses.find(a => a.id === selectedAddrId);

    try {
      // 1. 在数据库生成主订单 (状态为 pending_review)
      const { error: orderErr } = await supabase.from('orders').insert([{
        id: orderId,
        user_id: user?.id,
        total_amount: product.price,
        status: 'pending_review',
        payment_method: contactMethod,
        shipping_address: finalAddress // 存储当前地址快照
      }]);

      if (orderErr) throw orderErr;

      // 2. 生成订单明细
      const { error: itemErr } = await supabase.from('order_items').insert([{
        order_id: orderId,
        product_id: product.id,
        quantity: 1,
        price_at_purchase: product.price
      }]);

      if (itemErr) throw itemErr;

      // 3. 锁定库存 (调用之前写的 RPC)
      await supabase.rpc('increment_sales', { row_id: product.id, qty: 1 });

      // 4. 操作成功！直接关闭弹窗并跳转到你专门做的 Orders 页面
      setIsContactModalOpen(false);
      showToast('success', 'Order submitted. Redirecting to your manifests...');
      
      // 延迟一秒跳转，给用户看一眼成功提示，然后直接去订单页
      setTimeout(() => {
        router.push('/orders'); 
      }, 1500);

    } catch (err: any) {
      console.error(err);
      showToast('error', 'Transaction log failed. Please contact curator.');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#05070a] flex items-center justify-center"><Loader2 className="animate-spin text-[#00e0c6]" size={48} /></div>;

  return (
    <div className="checkout-theme-wrapper min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-12 md:py-20 relative z-10">
        
        {isSuccess ? (
          /* --- 成功视图：明确告知去 Account 查看 --- */
          <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center p-10 bg-black/20 rounded-3xl border border-white/5 shadow-2xl mt-10">
            <div className="w-20 h-20 bg-[#00e0c6] rounded-full flex items-center justify-center text-black text-4xl mb-6 shadow-[0_0_30px_rgba(0,224,198,0.4)]">
              <FaCheckCircle />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">Transfer Under Review</h1>
            <p className="text-gray-400 mb-8 max-w-xl leading-relaxed">
              Your order <strong className="text-white">#{orderId}</strong> has been recorded. Our curator will verify your Payoneer/Bank transfer within 12-24 hours. You can track the status in your account.
            </p>
            
            <div className="flex gap-4">
              <Link href="/account" className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6] text-black shadow-lg hover:scale-105 transition-transform">
                Track Order in Account
              </Link>
            </div>
          </div>
        ) : (
          /* --- 结算表单视图 --- */
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="w-full lg:w-[60%] flex flex-col gap-8">
              <h2 className="text-3xl font-serif font-bold tracking-wide">Acquisition Details</h2>
              
              <section className="checkout-pane flex flex-col sm:flex-row gap-6">
                <div className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-black">
                  <Image src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-serif font-bold mb-2">{product.title}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6] text-black">{product.edition || 'Collector'}</span>
                  </div>
                  <div className="flex justify-between items-end mt-auto">
                    <div className="text-2xl font-black text-gradient-checkout">${product.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-lg">Qty: 1</div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold">Shipping Manifest</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      onClick={() => setSelectedAddrId(addr.id)}
                      className={`address-card cursor-pointer flex justify-between items-center transition-all ${selectedAddrId === addr.id ? 'selected border-[#00e0c6] bg-[#00e0c6]/5' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <div className="p-5">
                        <div className="font-bold text-[15px] mb-1 text-white">{addr.recipient_name} <span className="text-gray-500 font-normal ml-2">{addr.phone}</span></div>
                        <div className="text-sm text-gray-400">{addr.address_line1}, {addr.city}, {addr.country}</div>
                      </div>
                      {selectedAddrId === addr.id && <div className="pr-5 text-xs font-bold uppercase tracking-widest text-[#00e0c6]">Selected</div>}
                    </div>
                  ))}
                  
                  <button onClick={() => setIsAddressModalOpen(true)} className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-[#00e0c6] transition-colors">
                    <FaPlus size={12} /> Add New Address
                  </button>
                </div>
              </section>
            </div>

            {/* 右侧：海外私域专属联络面板 */}
            <aside className="w-full lg:w-[40%] flex flex-col gap-8">
              <div className="checkout-pane sticky top-32">
                <div className="flex justify-between items-end mb-6">
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Investment</div>
                  <div className="text-3xl font-black text-white">${product.price.toLocaleString()}</div>
                </div>

                <div className="w-full h-px bg-white/10 my-6"></div>

                <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4">Concierge Channel</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Select a channel to receive our official Payoneer/Bank details and finalize your acquisition.
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {/* WhatsApp (海外优选) */}
                  <div onClick={() => setContactMethod('whatsapp')} className={`pay-method ${contactMethod === 'whatsapp' ? 'selected border-[#00e0c6] bg-[#00e0c6]/5' : 'border-white/5'} p-4 rounded-xl border transition-all cursor-pointer`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-2xl"><FaWhatsapp /></div>
                      <div>
                        <div className="font-bold text-white">WhatsApp</div>
                        <div className="text-xs text-gray-400">Global Priority Chat</div>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${contactMethod === 'whatsapp' ? 'border-[#00e0c6] bg-[#00e0c6]' : 'border-gray-500'}`}></div>
                  </div>

                  {/* Instagram (海外备选) */}
                  <div onClick={() => setContactMethod('instagram')} className={`pay-method ${contactMethod === 'instagram' ? 'selected border-[#00e0c6] bg-[#00e0c6]/5' : 'border-white/5'} p-4 rounded-xl border transition-all cursor-pointer`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center text-2xl"><FaInstagram /></div>
                      <div>
                        <div className="font-bold text-white">Instagram DM</div>
                        <div className="text-xs text-gray-400">Message Curator</div>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${contactMethod === 'instagram' ? 'border-[#00e0c6] bg-[#00e0c6]' : 'border-gray-500'}`}></div>
                  </div>

                  {/* WeChat (国内专属) */}
                  <div onClick={() => setContactMethod('wechat')} className={`pay-method ${contactMethod === 'wechat' ? 'selected border-[#00e0c6] bg-[#00e0c6]/5' : 'border-white/5'} p-4 rounded-xl border transition-all cursor-pointer`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#09B83E]/10 text-[#09B83E] flex items-center justify-center text-2xl"><FaWeixin /></div>
                      <div>
                        <div className="font-bold text-white">WeChat</div>
                        <div className="text-xs text-gray-400">Domestic Only</div>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${contactMethod === 'wechat' ? 'border-[#00e0c6] bg-[#00e0c6]' : 'border-gray-500'}`}></div>
                  </div>
                </div>

                <button onClick={handleProceed} className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[#071018] shadow-lg hover:scale-[1.02] transition-transform flex justify-center items-center gap-2 bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6]">
                  Connect & Pay
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />

      {/* 联络与确认汇款弹窗 */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f1113] border border-white/10 p-8 rounded-3xl w-full max-w-md text-center shadow-2xl relative">
            <h2 className="text-2xl font-serif font-bold mb-2">Complete Your Acquisition</h2>
            <p className="text-gray-400 text-sm mb-6">Order <strong className="text-white">#{orderId}</strong> is temporarily reserved.</p>
            
            {/* 动态展示对应的联络方式 */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
              {contactMethod === 'wechat' ? (
                <>
                  <div className="text-sm font-bold text-white mb-4">Step 1: Add Curator on WeChat</div>
                  <div className="w-40 h-40 mx-auto bg-white rounded-xl p-2 shadow-inner relative">
                    <Image src={WECHAT_QR} alt="WeChat QR" fill className="object-cover rounded-lg" />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-white mb-4">Step 1: Contact us for Payoneer details</div>
                  <a 
                    href={contactMethod === 'whatsapp' ? WHATSAPP_LINK : INSTAGRAM_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-colors ${contactMethod === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#1DA851]' : 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:brightness-110'}`}
                  >
                    {contactMethod === 'whatsapp' ? <FaWhatsapp size={20}/> : <FaInstagram size={20}/>}
                    Open {contactMethod === 'whatsapp' ? 'WhatsApp' : 'Instagram'} <ExternalLink size={16}/>
                  </a>
                </>
              )}
            </div>

            <div className="text-left bg-[#00e0c6]/5 border border-[#00e0c6]/20 p-4 rounded-xl mb-8">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#00e0c6] mb-1">Step 2: Confirm Transfer</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Once you have received our Payoneer/Bank details in the chat and completed the transfer of <strong className="text-white">${product.price.toLocaleString()}</strong>, click the button below to log your order into our system.
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setIsContactModalOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={handleFinalConfirm} className="flex-[1.5] py-3 rounded-xl bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6] text-black font-black uppercase tracking-widest shadow-lg">
                I Have Transferred
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增地址弹窗保持不变 */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f1113] border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setIsAddressModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20}/></button>
            <h2 className="text-2xl font-serif font-bold mb-6 text-white">Add Delivery Manifest</h2>
            
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="recipient_name" required placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e0c6] text-white" />
                <input name="phone" required placeholder="Phone Number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e0c6] text-white" />
              </div>
              <input name="address_line1" required placeholder="Street Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e0c6] text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" required placeholder="City" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e0c6] text-white" />
                <input name="region" placeholder="State/Region" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e0c6] text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="postal_code" placeholder="Postal Code" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e0c6] text-white" />
                <input name="country" required placeholder="Country" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e0c6] text-white" />
              </div>

              <button disabled={submittingAddress} type="submit" className="w-full mt-4 py-4 rounded-xl bg-[#00e0c6] text-black font-black uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-[#00c9b2] transition-colors">
                {submittingAddress ? <Loader2 className="animate-spin" size={18} /> : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}