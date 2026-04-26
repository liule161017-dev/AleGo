// app/account/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase'; 
import { Package, ChevronRight } from 'lucide-react'; // 引入图标
import './account.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileTab from './components/ProfileTab';
import AddressTab from './components/AddressTab';

export default function AccountPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // 默认 Tab 改回 profile，因为 orders 已经是独立页面了
  const [activeTab, setActiveTab] = useState<'profile' | 'address'>('profile'); 
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        await supabase.auth.signOut();
        router.push('/login');
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#0c0d12] flex items-center justify-center text-[#00edce]">Loading Sanctum...</div>;
  }

  return (
    <div className="account-theme-wrapper min-h-screen flex flex-col transition-colors duration-500" data-theme={theme}>
      
      <Navbar />

      <div className="flex-grow">
        {/* 悬浮主题按钮 */}
        {/* <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="fixed right-6 bottom-24 z-[90] w-12 h-12 rounded-full border flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-110"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          {theme === 'dark' ? '☀️' : '☾'}
        </button> */}

        {/* 欢迎头部区 */}
        <section className="text-center pt-24 pb-8 px-5 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-[40px] font-bold mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome Back, {profile?.first_name || 'Curator'}.
          </h1>
          <p className="text-[17px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Collector ID: <span className="text-[#ff2aa6] font-mono">{profile?.collector_id}</span>
          </p>
        </section>

        {/* 内容主体区 */}
        <main className="max-w-[1100px] mx-auto px-6">
          
          {/* ================= 新增：独立订单页跳转入口 ================= */}
          {/* <div 
            onClick={() => router.push('/orders')}
            className="mb-12 group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 rounded-3xl border cursor-pointer transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,237,206,0.1)] hover:-translate-y-1"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-6 mb-4 sm:mb-0">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00edce]/20 to-[#ff4fa6]/20 text-[#00edce] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <Package size={28} />
               </div>
               <div>
                 <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Order Manifests</h2>
                 <p className="text-sm font-bold uppercase tracking-widest text-[#ff4fa6]">
                   Track & Manage Acquisitions
                 </p>
               </div>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-[#00edce] transition-colors">
              Enter Library <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div> */}
          {/* ========================================================= */}

          <div className="flex justify-center gap-10 mb-12 border-b border-white/10">
            <button onClick={() => setActiveTab('profile')} className={`tab-btn relative pb-5 text-[15px] font-bold uppercase tracking-widest ${activeTab === 'profile' ? 'active' : ''}`}>
              Curator Profile
            </button>
            <button onClick={() => setActiveTab('address')} className={`tab-btn relative pb-5 text-[15px] font-bold uppercase tracking-widest ${activeTab === 'address' ? 'active' : ''}`}>
              Addresses
            </button>
          </div>

          {/* 根据 Tab 渲染 */}
          {activeTab === 'profile' && <ProfileTab profile={profile} />}
          {activeTab === 'address' && <AddressTab />}
        </main>
      </div>

      <Footer />
    </div>
  );
}